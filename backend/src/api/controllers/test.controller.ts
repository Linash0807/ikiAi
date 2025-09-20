import { Request, Response } from "express";
import { getUserProfile } from "../../data-access/user.repository";
import { getAiRecommendation } from "../../services/recommendation.service";
import { findPersonalizedJobs } from "../../services/jobSearch.service";
import { createRoadmapForJob } from "../../services/roadmap.service";
import { ChatInput } from "../../utils/zodSchemas";
import { handleChatMessage } from "../../services/chat.service";

export async function testProfile(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const profile = await getUserProfile(userId);
    res.status(200).json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function testRecommendation(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    // Sample Ikigai input
    const ikigaiData = {
      interests: ["AI", "Healthcare"],
      skills: ["Python", "Data Analysis"],
      values: ["Impact", "Growth"],
    };
    const result = await getAiRecommendation(ikigaiData, userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function testChat(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const sessionId = "test-session";
    const newMessage: ChatInput = { content: "What jobs fit my skills?" };
    // Run the chat workflow
    const aiResponse = await handleChatMessage(userId, sessionId, newMessage);
    res.status(200).json({ role: "ai", content: aiResponse });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function testJobs(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const query = "AI jobs in India";
    const result = await findPersonalizedJobs(userId, query);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function testRoadmap(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const jobDetails = {
      title: "Cloud Solutions Architect",
      company: "Microsoft",
      location: "Bangalore, India",
      description: "Design and implement cloud infrastructure for enterprise clients...",
      url: "https://careers.microsoft.com/"
    };
    const result = await createRoadmapForJob(userId, jobDetails);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
