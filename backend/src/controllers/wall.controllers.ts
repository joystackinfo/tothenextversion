import { Request, Response } from 'express'
import Wall from '../models/wall.model'
import Capsule from '../models/capsule.model'

interface AuthRequest extends Request {
  user?: {
    _id: string
  }
}

interface FormattedWallPost {
  _id: string
  title: string
  message: string
  currentMood: string
  currentSong: string
  currentHobby: string
  user: string
  createdAt: Date
  likes: number
  likedBy: string[]
  isAnonymous: boolean
}

// GET /api/wall
const getWall = async (req: Request, res: Response): Promise<void> => {
  try {
    const wall = await Wall.find()
      .populate('capsule', 'title message currentMood currentSong currentHobby createdAt')
      .populate('user', 'name username email')
      .sort({ createdAt: -1 })

    // reshape response for frontend - flatten it
    const formattedWall: FormattedWallPost[] = wall
      .filter(post => post.capsule)
      .map(post => ({
        _id: post._id.toString(),
        title: (post.capsule as any).title,
        message: (post.capsule as any).message,
        currentMood: (post.capsule as any).currentMood,
        currentSong: (post.capsule as any).currentSong,
        currentHobby: (post.capsule as any).currentHobby,
        user: (post.user as any).username,
        createdAt: (post.capsule as any).createdAt,
        likes: post.likes,
        likedBy: post.likedBy.map((id: any) => id.toString()),
        isAnonymous: post.isAnonymous,
      }))

    res.json(formattedWall)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// PATCH /api/capsules/wall/:id/like
const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Wall.findById(req.params.id)

    if (!post) {
      res.status(404).json({ message: 'Post not found' })
      return
    }

    const alreadyLiked = post.likedBy.some(id => id.equals(req.user?._id))

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => !id.equals(req.user?._id))
      post.likes -= 1
    } else {
      post.likedBy.push(req.user?._id as any)
      post.likes += 1
    }

    await post.save()
    res.json({ likes: post.likes, likedBy: post.likedBy })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// POST /api/capsules/:id/share
const shareToWall = async (req: AuthRequest, res: Response): Promise<void> => {
  const { isAnonymous } = req.body
  const { id } = req.params

  try {
    const capsule = await Capsule.findById(id)

    if (!capsule) {
      res.status(404).json({ message: 'Capsule not found' })
      return
    }

    if (capsule.user.toString() !== req.user?._id?.toString()) {
      res.status(401).json({ message: 'Not authorized' })
      return
    }

    const isLocked = new Date(capsule.unlockDate) > new Date()

    if (isLocked) {
      res.status(400).json({ message: 'Cannot share a locked capsule' })
      return
    }

    const alreadyShared = await Wall.findOne({ capsule: id })
    if (alreadyShared) {
      res.status(400).json({ message: 'Capsule already shared' })
      return
    }

    capsule.isPublic = true
    await capsule.save()

    const post = await Wall.create({
        
      capsule: new (require('mongoose')).Types.ObjectId(id),
      user: req.user?._id,
      isAnonymous: isAnonymous || false,
    })

    res.status(201).json(post)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

export { getWall, likePost, shareToWall }