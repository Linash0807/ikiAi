import { Router } from "express";
import { handleCreateRoadmap, handleUpdateTask } from "../controllers/roadmap.controller";
import { verifyAuth } from "../middlewares/verifyAuth.middleware";

const router = Router();

router.post("/", verifyAuth, handleCreateRoadmap);
router.put("/:roadmapId/task", verifyAuth, handleUpdateTask);

export default router;

