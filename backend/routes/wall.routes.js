const express = require('express');
const router = express.Router();
const { createCapsule, getCapsules, getCapsule, deleteCapsule } = require('../controllers/capsule.controller');
const { getWall, likePost, shareToWall } = require('../controllers/wall.controller');
const protect = require('../middleware/auth.middleware');
router.get('/test', (req, res) => {
    res.json({ message: 'test works' });
});

// Share to wall
router.get('/', protect, getWall);
router.post('/:id/share', protect, shareToWall); 
router.patch('/:id/like', protect, likePost);


module.exports = router;