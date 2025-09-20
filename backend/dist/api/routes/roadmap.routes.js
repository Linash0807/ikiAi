"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roadmap_controller_1 = require("../controllers/roadmap.controller");
const verifyAuth_middleware_1 = require("../middlewares/verifyAuth.middleware");
const router = (0, express_1.Router)();
router.post("/", verifyAuth_middleware_1.verifyAuth, roadmap_controller_1.handleCreateRoadmap);
router.put("/:roadmapId/task", verifyAuth_middleware_1.verifyAuth, roadmap_controller_1.handleUpdateTask);
exports.default = router;
