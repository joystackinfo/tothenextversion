"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // grab token after "Bearer "
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = await user_model_1.default.findById(decoded.id).select('-password'); // attach user to request
            next(); // move to next route
        }
        catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.default = protect;
