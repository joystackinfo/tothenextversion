"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capsule_controller_1 = require("../controllers/capsule.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// protect means you must be logged in to hit these routes
router.post('/', auth_middleware_1.default, capsule_controller_1.createCapsule);
router.get('/', auth_middleware_1.default, capsule_controller_1.getCapsules);
router.get('/:id', auth_middleware_1.default, capsule_controller_1.getCapsule);
router.delete('/:id', auth_middleware_1.default, capsule_controller_1.deleteCapsule);
exports.default = router;
