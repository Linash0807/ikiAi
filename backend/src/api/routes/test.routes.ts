import { Router } from "express";
import { testProfile, testRecommendation, testChat, testJobs, testRoadmap } from "../controllers/test.controller";
const router = Router();

router.get("/profile/:userId", testProfile);
router.post("/recommendation/:userId", testRecommendation);
router.post("/chat/:userId", testChat);
router.post("/jobs/:userId", testJobs);
router.post("/roadmap/:userId", testRoadmap);

export default router;
