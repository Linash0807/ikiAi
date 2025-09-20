function cleanJsonResponse(text: string): string {
  // Remove triple backticks and optional 'json' label
  let cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/g, "")
    .trim();
  // Extract first valid JSON object from the string
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getUserProfile } from "../data-access/user.repository";
import { saveRoadmap } from "../data-access/roadmap.repository";
import { JobDetailsSchema } from "../utils/zodSchemas";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_GENAI_API_KEY ?? "",
});

export async function createRoadmapForJob(userId: string, jobDetails: z.infer<typeof JobDetailsSchema>) {
  const userProfile = await getUserProfile(userId);

  const prompt = `You are a career coach. A user with the following profile wants to apply for a specific job. Create a detailed, 90-day action plan (roadmap) that bridges their current skill set with the job's requirements. Identify skill gaps and create a checklist of concrete tasks (learning, projects, networking) to make them a top candidate.
  USER PROFILE: ${JSON.stringify(userProfile)}
  TARGET JOB: ${JSON.stringify(jobDetails)}
  Respond ONLY with a JSON object with the format: { "roadmap90Days": [ { "phase": "Month 1: Foundation", "tasks": ["Task 1", "Task 2"] } ] }`;

  const response = await model.invoke(prompt);
  const cleaned = cleanJsonResponse(response.content.toString());
  const roadmapData = JSON.parse(cleaned);

  const roadmapToSave = {
    jobDetails,
    roadmap: roadmapData.roadmap90Days,
  };

  const roadmapId = await saveRoadmap(userId, roadmapToSave);
  return { roadmapId, ...roadmapToSave };
}

