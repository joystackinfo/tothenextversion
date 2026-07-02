import { Router, Request, Response } from 'express'
import { getWall, likePost, shareToWall } from '../controllers/wall.controllers'
import protect from '../middleware/auth.middleware'

const router = Router()

router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'test works' })
})

router.get('/', protect, getWall)
router.post('/:id/share', protect, shareToWall)
router.patch('/:id/like', protect, likePost)

export default router