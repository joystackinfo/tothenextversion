import { Request, Response } from 'express'
import Capsule from '../models/capsule.model'
import Wall from '../models/wall.model'

interface AuthRequest extends Request {
  user?: {
    _id: string
  }
}

// POST /api/capsules
const createCapsule = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, message, currentAge, currentMood, currentGoal, currentHobby, currentSong, unlockDate, photo } = req.body

  try {
    const capsule = await Capsule.create({
      user: req.user?._id,
      title,
      message,
      currentAge,
      currentMood,
      currentGoal,
      currentHobby,
      currentSong,
      unlockDate,
      photo,
    })

    res.status(201).json(capsule)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// GET /api/capsules
const getCapsules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const capsules = await Capsule.find({ user: req.user?._id }).sort({ createdAt: -1 })

    // calculate isLocked for each capsule
    const capsulesWithStatus = capsules.map(capsule => {
      const unlockDate = new Date(capsule.unlockDate)
      const now = new Date()
      capsule.isLocked = unlockDate > now
      return capsule
    })

    res.json(capsulesWithStatus)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// GET /api/capsules/:id
const getCapsule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const capsule = await Capsule.findById(req.params.id)

    if (!capsule) {
      res.status(404).json({ message: 'Capsule not found' })
      return
    }

    if (capsule.user.toString() !== req.user?._id?.toString()) {
      res.status(401).json({ message: 'Not authorized' })
      return
    }

    // calculate isLocked
    const unlockDate = new Date(capsule.unlockDate)
    const now = new Date()
    capsule.isLocked = unlockDate > now

    res.json(capsule)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// DELETE /api/capsules/:id
const deleteCapsule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const capsule = await Capsule.findById(req.params.id)

    if (!capsule) {
      res.status(404).json({ message: 'Capsule not found' })
      return
    }

    if (capsule.user.toString() !== req.user?._id?.toString()) {
      res.status(401).json({ message: 'Not authorized' })
      return
    }

    await Wall.deleteOne({ capsule: capsule._id })
    await capsule.deleteOne()
    res.json({ message: 'Capsule deleted' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

export { createCapsule, getCapsules, getCapsule, deleteCapsule }