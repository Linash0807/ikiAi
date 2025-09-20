import { Router } from "express";
import { createRecommendation } from "../controllers/recommendation.controller";
import { verifyAuth } from "../middlewares/verifyAuth.middleware";

const router = Router();

router.post("/", verifyAuth, createRecommendation);

export default router;






