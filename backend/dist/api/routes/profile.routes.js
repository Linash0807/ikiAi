"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const profile_controller_1 = require("../controllers/profile.controller");
const verifyAuth_middleware_1 = require("../middlewares/verifyAuth.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
router.get('/', verifyAuth_middleware_1.verifyAuth, profile_controller_1.getProfile);
router.put('/', verifyAuth_middleware_1.verifyAuth, profile_controller_1.updateProfile);
router.post('/picture', verifyAuth_middleware_1.verifyAuth, upload.single('profilePicture'), (req, res) => (0, profile_controller_1.uploadFile)(req, res, 'picture'));
router.post('/resume', verifyAuth_middleware_1.verifyAuth, upload.single('resumeFile'), (req, res) => (0, profile_controller_1.uploadFile)(req, res, 'resume'));
exports.default = router;
