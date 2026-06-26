const Wall = require('../models/wall.model');
const Capsule = require('../models/capsule.model');

// GET /api/wall
const getWall = async (req, res) => {
    try {
        const wall = await Wall.find()
            .populate('capsule', 'title message currentMood currentSong currentHobby createdAt')
            .populate('user', 'name username email')
            .sort({ createdAt: -1 });

        // reshape response for frontend - flatten it
        const formattedWall = wall.map(post => ({
            _id: post._id,
            title: post.capsule.title,
            message: post.capsule.message,
            currentMood: post.capsule.currentMood,
            currentSong: post.capsule.currentSong,
            currentHobby: post.capsule.currentHobby,
            user: post.user.username, // username directly
            createdAt: post.capsule.createdAt,
            likes: post.likes,
            isAnonymous: post.isAnonymous,
        }));

        res.json(formattedWall);
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

// POST /api/capsules/:id/share
const shareToWall = async (req, res) => {
    const { isAnonymous } = req.body;
    const { id } = req.params;

    try {
        const capsule = await Capsule.findById(id);

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        if (capsule.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (capsule.isLocked) {
            return res.status(400).json({ message: 'Cannot share a locked capsule' });
        }

        const alreadyShared = await Wall.findOne({ capsule: id });
        if (alreadyShared) {
            return res.status(400).json({ message: 'Capsule already shared' });
        }

        capsule.isPublic = true;
        await capsule.save();

        const post = await Wall.create({
            capsule: id,
            user: req.user._id,
            isAnonymous: isAnonymous || false,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWall, likePost, shareToWall };