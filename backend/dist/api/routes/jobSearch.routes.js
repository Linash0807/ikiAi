"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobSearch_controller_1 = require("../controllers/jobSearch.controller");
const verifyAuth_middleware_1 = require("../middlewares/verifyAuth.middleware");
const router = (0, express_1.Router)();
router.post("/search", verifyAuth_middleware_1.verifyAuth, jobSearch_controller_1.createJobSearch);
exports.default = router;
