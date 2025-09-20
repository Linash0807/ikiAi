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
import { IkigaiInputSchema, RecommendationOutputSchema, IkigaiInput, RecommendationOutput } from "../utils/zodSchemas";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

// NOTE: The real langgraph.js API differs across versions; for hackathon speed,
// we simulate a tiny stateful flow with simple functions.

dotenv.config();

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_GENAI_API_KEY ?? "",
});

type GraphState = {
  ikigaiData: IkigaiInput;
  userId: string;
  aiResult?: RecommendationOutput;
};

async function generateRecommendationNode(state: GraphState): Promise<GraphState> {
  const { ikigaiData } = state;
  // Inside generateRecommendationNode function...

const formatHint = `
{
  "personalizedSummary": "...",
  "recommendedCareers": [
    { "title": "...", "description": "...", "whyFit": "...", "ikigaiAlignment": { "love": "...", "goodAt": "...", "worldNeeds": "...", "paidFor": "..." } }
  ],
  "skillDevelopmentPlan": [
    { "skill": "SQL", "type": "technical" },
    { "skill": "Communication", "type": "soft" }
  ],
  "roadmap90Days": [
    { "phase": "Week 1–4", "tasks": ["Task 1", "Task 2"] },
    { "phase": "Month 2", "tasks": ["Task 1", "Task 2"] },
    { "phase": "Month 3", "tasks": ["Task 1", "Task 2"] }
  ]
}
`;

const prompt = `You are an expert career advisor.
Given the user's Ikigai data:
- Interests: ${ikigaiData.interests.join(", ")}
- Skills: ${ikigaiData.skills.join(", ")}
- Values: ${ikigaiData.values.join(", ")}
${ikigaiData.personalityType ? `- Personality: ${ikigaiData.personalityType}` : ""}

Instructions:
- Create a personalizedSummary.
- Recommend 2 diverse career paths with title, description, whyFit, and ikigaiAlignment.
- Provide a skillDevelopmentPlan with a mix of technical and soft skills.
- **Crucially, create a detailed 90-day roadmap with 3 phases (Week 1-4, Month 2, Month 3) and 2-3 specific tasks per phase.**
- Return ONLY valid JSON matching this format (no markdown, no backticks):\n${formatHint}
`;

// The rest of your service file remains the same...

  // Using the LangChain ChatGoogleGenerativeAI wrapper
 const response = await gemini.invoke(prompt);

 // The content is directly available on the .content property
 const text = response.content.toString();
 let parsed: unknown;
 try {
   const cleaned = cleanJsonResponse(text);
   parsed = JSON.parse(cleaned);
 } catch (e) {
   throw new Error("AI response is not valid JSON");
 }

 return { ...state, aiResult: parsed as RecommendationOutput };
}

async function validateOutputNode(state: GraphState): Promise<GraphState> {
  const parsed = RecommendationOutputSchema.safeParse(state.aiResult);
  if (!parsed.success) {
    throw new Error("AI output validation failed");
  }
  return state;
}

export async function getAiRecommendation(ikigaiData: unknown, userId: string): Promise<RecommendationOutput> {
  const validatedInput = IkigaiInputSchema.parse(ikigaiData);
  let state: GraphState = { ikigaiData: validatedInput, userId };
  state = await generateRecommendationNode(state);
  state = await validateOutputNode(state);
  return state.aiResult!;
}


