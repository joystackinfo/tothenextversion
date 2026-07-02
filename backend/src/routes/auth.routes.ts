import { Router } from 'express'
import { register, login, forgotPassword, resetPassword, updateProfile } from '../controllers/auth.controller'
import protect from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.put('/profile', protect, updateProfile)

export default router