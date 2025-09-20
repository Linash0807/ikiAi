import { Router } from "express";
import multer from "multer";
import { verifyAuth } from "../middlewares/verifyAuth.middleware";
import { handleFileUpload } from "../controllers/knowledge.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/upload", verifyAuth, upload.single("file"), handleFileUpload);

export default router;



