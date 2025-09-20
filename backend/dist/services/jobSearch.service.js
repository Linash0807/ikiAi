"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPersonalizedJobs = findPersonalizedJobs;
// src/services/jobSearch.service.ts
const google_genai_1 = require("@langchain/google-genai");
const user_repository_1 = require("../data-access/user.repository"); // Assume getPrimaryRoadmap exists
const serpapi_1 = require("../tools/serpapi");
const zodSchemas_1 = require("../utils/zodSchemas");
const model = new google_genai_1.ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
    model: "gemini-1.5-flash",
});
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
async function findPersonalizedJobs(userId, query) {
    const userProfile = await (0, user_repository_1.getUserProfile)(userId);
    const roadmap = await (0, user_repository_1.getPrimaryRoadmap)(userId); // You may need to implement this repository function
    // AI Step 1: Synthesize Profile
    const synthesisPrompt = `Synthesize this user profile and career roadmap into a concise, keyword-rich summary of their professional identity, skills, and goals.\nPROFILE: ${JSON.stringify(userProfile)}\nROADMAP: ${JSON.stringify(roadmap)}`;
    const synthesisResponse = await model.invoke(synthesisPrompt);
    const professionalSummary = synthesisResponse.content.toString();
    // AI Step 2: Generate Search Query
    const queryGenPrompt = `You are an expert technical recruiter. Based on the user's professional summary and their search request, generate the optimal search query string for a job API.\nUSER SUMMARY: ${professionalSummary}\nUSER REQUEST: "${query}"`;
    const queryGenResponse = await model.invoke(queryGenPrompt);
    const generatedQuery = queryGenResponse.content.toString();
    // Step 3: Use the Search Tool
    const rawJobListings = await (0, serpapi_1.searchJobsAPI)(generatedQuery);
    // AI Step 4: Rank and Personalize
    const personalizationPrompt = `You are a career strategist. Given a user's full profile and a list of jobs, categorize these jobs into three lists: 1. 'passionRoles' (aligning with user's interests), 2. 'strengthRoles' (matching existing skills), and 3. 'growthRoles' (strategic stepping stones). For each job, add a 'personalizedFit' summary.\nUSER PROFILE: ${JSON.stringify(userProfile)}\nJOB LISTINGS: ${JSON.stringify(rawJobListings)}\nRespond ONLY with a valid JSON object matching this schema: { "passionRoles": [], "strengthRoles": [], "growthRoles": [] }`;
    const personalizationResponse = await model.invoke(personalizationPrompt);
    const cleaned = cleanJsonResponse(personalizationResponse.content.toString());
    const finalResult = JSON.parse(cleaned);
    // Post-process: fill missing required fields with empty strings
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    function fixJobDetails(arr) {
        return arr.map(job => ({
            ...job,
            description: typeof job.description === "string" ? job.description : "",
            url: typeof job.url === "string" && isValidUrl(job.url) ? job.url : "https://example.com/job"
        }));
    }
    if (finalResult.passionRoles)
        finalResult.passionRoles = fixJobDetails(finalResult.passionRoles);
    if (finalResult.strengthRoles)
        finalResult.strengthRoles = fixJobDetails(finalResult.strengthRoles);
    if (finalResult.growthRoles)
        finalResult.growthRoles = fixJobDetails(finalResult.growthRoles);
    return zodSchemas_1.JobSearchOutputSchema.parse(finalResult);
}
