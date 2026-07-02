"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// POST /api/auth/register
const register = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_1.default.create({
            name,
            username,
            email,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.register = register;
// POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.login = login;
// PUT /api/auth/profile
const updateProfile = async (req, res) => {
    const { username, tagline } = req.body;
    try {
        const user = await user_model_1.default.findByIdAndUpdate(req.user?._id, { username, tagline }, { new: true });
        res.json({
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            username: user?.username,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errorMessage });
    }
};
exports.updateProfile = updateProfile;
// Placeholder functions (not implemented yet)
const forgotPassword = async (req, res) => {
    res.json({ message: 'forgotPassword not implemented' });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    res.json({ message: 'resetPassword not implemented' });
};
exports.resetPassword = resetPassword;
