const express = require('express');
const router = express.Router();
const { createCapsule, getCapsules, getCapsule, deleteCapsule } = require('../controllers/capsule.controller');
const protect = require('../middleware/auth.middleware');

// protect means you must be logged in to hit these routes

router.post('/', protect, createCapsule);
router.get('/', protect, getCapsules);
router.get('/:id', protect, getCapsule);
router.delete('/:id', protect, deleteCapsule);

module.exports = router;