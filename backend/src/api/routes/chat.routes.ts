import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth.middleware";
import { postChatMessage, listUserSessions, getSessionDetails, startNewSession } from "../controllers/chat.controller";

const router = Router();

router.get("/sessions", verifyAuth, listUserSessions);
router.get("/sessions/:sessionId", verifyAuth, getSessionDetails);
router.post("/sessions/:sessionId/messages", verifyAuth, postChatMessage);
router.post("/sessions", verifyAuth, startNewSession);

export default router;


