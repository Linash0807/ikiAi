import { Router } from "express";

import recommendationRoutes from "./recommendation.routes";
import chatRoutes from "./chat.routes";
import healthRoutes from "./health.routes";
import knowledgeRoutes from "./knowledge.routes";
import profileRoutes from "./profile.routes";
import roadmapRoutes from "./roadmap.routes";

import jobSearchRoutes from "./jobSearch.routes";
import testRoutes from "./test.routes";

const router = Router();


router.use("/health", healthRoutes);
router.use("/recommendation", recommendationRoutes);
router.use("/chat", chatRoutes);
router.use("/knowledge", knowledgeRoutes);
router.use("/profile", profileRoutes);
router.use("/roadmaps", roadmapRoutes);

router.use("/jobs", jobSearchRoutes);
router.use("/test", testRoutes);

export default router;




