import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

interface DecodedToken {
  id: string
}

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1] // grab token after "Bearer "

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
      req.user = await User.findById(decoded.id).select('-password') // attach user to request

      next() // move to next route
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, invalid token' })
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' })
  }
}

export default protect