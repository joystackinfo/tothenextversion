import { Request, Response } from 'express'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

interface AuthRequest extends Request {
  user?: {
    _id: string
  }
}

// POST /api/auth/register
const register = async (req: Request, res: Response): Promise<void> => {
  const { name, username, email, password } = req.body

  try {
    const hashedPassword = await bcryptjs.hash(password, 10)
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// POST /api/auth/login
const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// PUT /api/auth/profile
const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { username, tagline } = req.body

  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { username, tagline },
      { new: true }
    )

    res.json({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      username: user?.username,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ message: errorMessage })
  }
}

// Placeholder functions (not implemented yet)
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'forgotPassword not implemented' })
}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'resetPassword not implemented' })
}

export { register, login, forgotPassword, resetPassword, updateProfile }