const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, updateProfile } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');


router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/profile', protect, updateProfile)

module.exports = router;