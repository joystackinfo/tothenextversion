import { Router } from 'express'
import { createCapsule, getCapsules, getCapsule, deleteCapsule } from '../controllers/capsule.controller'
import protect from '../middleware/auth.middleware'

const router = Router()

// protect means you must be logged in to hit these routes

router.post('/', protect, createCapsule)
router.get('/', protect, getCapsules)
router.get('/:id', protect, getCapsule)
router.delete('/:id', protect, deleteCapsule)

export default router