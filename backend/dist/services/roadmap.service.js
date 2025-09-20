"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoadmapForJob = createRoadmapForJob;
function cleanJsonResponse(text) {
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
const google_genai_1 = require("@langchain/google-genai");
const user_repository_1 = require("../data-access/user.repository");
const roadmap_repository_1 = require("../data-access/roadmap.repository");
const model = new google_genai_1.ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_GENAI_API_KEY ?? "",
});
async function createRoadmapForJob(userId, jobDetails) {
    const userProfile = await (0, user_repository_1.getUserProfile)(userId);
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
    const roadmapId = await (0, roadmap_repository_1.saveRoadmap)(userId, roadmapToSave);
    return { roadmapId, ...roadmapToSave };
}
