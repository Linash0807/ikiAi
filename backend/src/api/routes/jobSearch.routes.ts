import { Router } from "express";
import { createJobSearch } from "../controllers/jobSearch.controller";
import { verifyAuth } from "../middlewares/verifyAuth.middleware";
const router = Router();
router.post("/search", verifyAuth, createJobSearch);
export default router;
