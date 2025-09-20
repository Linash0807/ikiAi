"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const verifyAuth_middleware_1 = require("../middlewares/verifyAuth.middleware");
const knowledge_controller_1 = require("../controllers/knowledge.controller");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.post("/upload", verifyAuth_middleware_1.verifyAuth, upload.single("file"), knowledge_controller_1.handleFileUpload);
exports.default = router;
