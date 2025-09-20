import { Request, Response } from "express";
import { handleChatMessage } from "../../services/chat.service";
import { ChatInputSchema } from "../../utils/zodSchemas";
import { getSessionMessages, getUserSessions, createNewSession } from "../../data-access/chat.repository";

export const postChatMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const { sessionId } = req.params as { sessionId: string };

    const parsedBody = ChatInputSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: "Invalid request body", details: parsedBody.error.errors });
    }

    const newMessage = parsedBody.data;
    const aiResponse = await handleChatMessage(userId, sessionId, newMessage);
    res.status(200).json({ reply: aiResponse });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
};

export const listUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const sessions = await getUserSessions(userId);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error listing user sessions:", error);
    res.status(500).json({ error: "Failed to retrieve sessions." });
  }
};

export const getSessionDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const { sessionId } = req.params as { sessionId: string };
    const messages = await getSessionMessages(userId, sessionId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting session details:", error);
    res.status(500).json({ error: "Failed to retrieve session messages." });
  }
};

export const startNewSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const sessionId = await createNewSession(userId);
    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Error starting new session:", error);
    res.status(500).json({ error: "Failed to start a new session." });
  }
};


