import { Request, Response } from "express";
import { getAiRecommendation } from "../../services/recommendation.service";
import { saveRecommendation } from "../../data-access/recommendation.repository";
import { v4 as uuidv4 } from "uuid";

export async function createRecommendation(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const ikigaiData = req.body;
    const aiResult = await getAiRecommendation(ikigaiData, userId);
    const sessionId = uuidv4();
    await saveRecommendation(userId, sessionId, aiResult);
    res.status(201).json({ sessionId, recommendation: aiResult });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Failed to generate recommendation" });
  }
}






