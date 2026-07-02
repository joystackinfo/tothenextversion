"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCapsule = exports.getCapsule = exports.getCapsules = exports.createCapsule = void 0;
const capsule_model_1 = __importDefault(require("../models/capsule.model"));
const wall_model_1 = __importDefault(require("../models/wall.model"));
// POST /api/capsules
const createCapsule = async (req, res) => {
    const { title, message, currentAge, currentMood, currentGoal, currentHobby, currentSong, unlockDate, photo } = req.body;
    try {
        const capsule = await capsule_model_1.default.create({
            user: req.user?._id,
            title,
            message,
            currentAge,
            currentMood,
            currentGoal,
            currentHobby,
            currentSong,
            unlockDate,
            photo,
        });
        res.status(201).json(capsule);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.createCapsule = createCapsule;
// GET /api/capsules
const getCapsules = async (req, res) => {
    try {
        const capsules = await capsule_model_1.default.find({ user: req.user?._id }).sort({ createdAt: -1 });
        // calculate isLocked for each capsule
        const capsulesWithStatus = capsules.map(capsule => {
            const unlockDate = new Date(capsule.unlockDate);
            const now = new Date();
            capsule.isLocked = unlockDate > now;
            return capsule;
        });
        res.json(capsulesWithStatus);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.getCapsules = getCapsules;
// GET /api/capsules/:id
const getCapsule = async (req, res) => {
    try {
        const capsule = await capsule_model_1.default.findById(req.params.id);
        if (!capsule) {
            res.status(404).json({ message: 'Capsule not found' });
            return;
        }
        if (capsule.user.toString() !== req.user?._id?.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        // calculate isLocked
        const unlockDate = new Date(capsule.unlockDate);
        const now = new Date();
        capsule.isLocked = unlockDate > now;
        res.json(capsule);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.getCapsule = getCapsule;
// DELETE /api/capsules/:id
const deleteCapsule = async (req, res) => {
    try {
        const capsule = await capsule_model_1.default.findById(req.params.id);
        if (!capsule) {
            res.status(404).json({ message: 'Capsule not found' });
            return;
        }
        if (capsule.user.toString() !== req.user?._id?.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        await wall_model_1.default.deleteOne({ capsule: capsule._id });
        await capsule.deleteOne();
        res.json({ message: 'Capsule deleted' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.deleteCapsule = deleteCapsule;
