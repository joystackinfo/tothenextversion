"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareToWall = exports.likePost = exports.getWall = void 0;
const wall_model_1 = __importDefault(require("../models/wall.model"));
const capsule_model_1 = __importDefault(require("../models/capsule.model"));
// GET /api/wall
const getWall = async (req, res) => {
    try {
        const wall = await wall_model_1.default.find()
            .populate('capsule', 'title message currentMood currentSong currentHobby createdAt')
            .populate('user', 'name username email')
            .sort({ createdAt: -1 });
        // reshape response for frontend - flatten it
        const formattedWall = wall
            .filter(post => post.capsule)
            .map(post => ({
            _id: post._id.toString(),
            title: post.capsule.title,
            message: post.capsule.message,
            currentMood: post.capsule.currentMood,
            currentSong: post.capsule.currentSong,
            currentHobby: post.capsule.currentHobby,
            user: post.user.username,
            createdAt: post.capsule.createdAt,
            likes: post.likes,
            likedBy: post.likedBy.map((id) => id.toString()),
            isAnonymous: post.isAnonymous,
        }));
        res.json(formattedWall);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.getWall = getWall;
// PATCH /api/capsules/wall/:id/like
const likePost = async (req, res) => {
    try {
        const post = await wall_model_1.default.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const alreadyLiked = post.likedBy.some(id => id.equals(req.user?._id));
        if (alreadyLiked) {
            post.likedBy = post.likedBy.filter(id => !id.equals(req.user?._id));
            post.likes -= 1;
        }
        else {
            post.likedBy.push(req.user?._id);
            post.likes += 1;
        }
        await post.save();
        res.json({ likes: post.likes, likedBy: post.likedBy });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.likePost = likePost;
// POST /api/capsules/:id/share
const shareToWall = async (req, res) => {
    const { isAnonymous } = req.body;
    const { id } = req.params;
    try {
        const capsule = await capsule_model_1.default.findById(id);
        if (!capsule) {
            res.status(404).json({ message: 'Capsule not found' });
            return;
        }
        if (capsule.user.toString() !== req.user?._id?.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const isLocked = new Date(capsule.unlockDate) > new Date();
        if (isLocked) {
            res.status(400).json({ message: 'Cannot share a locked capsule' });
            return;
        }
        const alreadyShared = await wall_model_1.default.findOne({ capsule: id });
        if (alreadyShared) {
            res.status(400).json({ message: 'Capsule already shared' });
            return;
        }
        capsule.isPublic = true;
        await capsule.save();
        const post = await wall_model_1.default.create({
            capsule: new (require('mongoose')).Types.ObjectId(id),
            user: req.user?._id,
            isAnonymous: isAnonymous || false,
        });
        res.status(201).json(post);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.shareToWall = shareToWall;
