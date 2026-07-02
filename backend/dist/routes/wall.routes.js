"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wall_controllers_1 = require("../controllers/wall.controllers");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.get('/test', (req, res) => {
    res.json({ message: 'test works' });
});
router.get('/', auth_middleware_1.default, wall_controllers_1.getWall);
router.post('/:id/share', auth_middleware_1.default, wall_controllers_1.shareToWall);
router.patch('/:id/like', auth_middleware_1.default, wall_controllers_1.likePost);
exports.default = router;
