"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendation_controller_1 = require("../controllers/recommendation.controller");
const verifyAuth_middleware_1 = require("../middlewares/verifyAuth.middleware");
const router = (0, express_1.Router)();
router.post("/", verifyAuth_middleware_1.verifyAuth, recommendation_controller_1.createRecommendation);
exports.default = router;
