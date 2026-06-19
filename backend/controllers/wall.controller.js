const Wall = require('../models/wall.model');
const Capsule = require('../models/capsule.model');


// GET /api/wall
const getWall = async (req, res) => {
    try {
        const wall = await Wall.find()
            .populate('capsule', 'title message currentMood currentGoal createdAt') // grab these fields from the capsule
            .populate('user', 'name username') // grab name and username from user
            .sort({ createdAt: -1 });

        res.json(wall);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH /api/wall/:id/like
const likePost = async (req, res) => {
    try {
        const post = await Wall.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes += 1;
        await post.save();

        res.json({ likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/wall (called when user opens a capsule and chooses to share)
const shareToWall = async (req, res) => {
    const { capsuleId, isAnonymous } = req.body;

    try {
        const capsule = await Capsule.findById(capsuleId);

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        if (capsule.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // make sure capsule is unlocked before sharing
        if (capsule.isLocked) {
            return res.status(400).json({ message: 'Cannot share a locked capsule' });
        }

        // check if already shared
        const alreadyShared = await Wall.findOne({ capsule: capsuleId });
        if (alreadyShared) {
            return res.status(400).json({ message: 'Capsule already shared' });
        }

        capsule.isPublic = true;
        await capsule.save();

        const post = await Wall.create({
            capsule: capsuleId,
            user: req.user._id,
            isAnonymous,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWall, likePost, shareToWall };