const Capsule = require('../models/capsule.model');

// POST /api/capsules
const createCapsule = async (req, res) => {
    const {
        title, message, currentAge, currentMood, currentGoal,
        currentHobby, currentSong, currentShow, whatWillChange,
        whatSkillsWillYouLearn, whatAreYouWorriedAbout, unlockDate, photo
    } = req.body;

    try {
        const capsule = await Capsule.create({
            user: req.user._id, // comes from auth middleware
            title,
            message,
            currentAge,
            currentMood,
            currentGoal,
            currentHobby,
            currentSong,
            currentShow,
            whatWillChange,
            whatSkillsWillYouLearn,
            whatAreYouWorriedAbout,
            unlockDate,
            photo,
        });

        res.status(201).json(capsule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/capsules
const getCapsules = async (req, res) => {
    try {
        const capsules = await Capsule.find({ user: req.user._id }).sort({ createdAt: -1 }); 
        res.json(capsules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/capsules/:id
const getCapsule = async (req, res) => {
    try {
        const capsule = await Capsule.findById(req.params.id);

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        // make sure the capsule belongs to the logged in user
        if (capsule.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(capsule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/capsules/:id
const deleteCapsule = async (req, res) => {
    try {
        const capsule = await Capsule.findById(req.params.id);

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        if (capsule.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await capsule.deleteOne();
        res.json({ message: 'Capsule deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCapsule, getCapsules, getCapsule, deleteCapsule };