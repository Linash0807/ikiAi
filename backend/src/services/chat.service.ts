import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, BaseMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMessage, ChatInput } from "../utils/zodSchemas";
import { getSessionMessages, addMessageToSession } from "../data-access/chat.repository";
import { queryRelevant } from "../services/vectorstore.service";
import { getUserProfile } from "../data-access/user.repository";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  model: "gemini-1.5-flash",
});

interface GraphState {
  userId: string;
  sessionId: string;
  newMessage: ChatInput;
  history: BaseMessage[];
  context?: string;
  aiResponse?: string;
}

// ✅ Node 1: Retrieve chat history from Firestore
const getHistory = async (state: GraphState): Promise<Partial<GraphState>> => {
  const { userId, sessionId } = state;
  const messages: ChatMessage[] = await getSessionMessages(userId, sessionId);

  const history: BaseMessage[] = messages.map((msg) =>
    msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
  );

  return { history };
};

// ✅ Node 2: Call Gemini with injected profile + RAG context
const callModel = async (state: GraphState): Promise<Partial<GraphState>> => {
  const { history, newMessage, context, userId } = state;

  // --- Step 1: Fetch Firestore Profile ---
  let profileContext = "⚠️ No user profile found in Firestore.";
  try {
    const profile = await getUserProfile(userId);
    console.log("🔥 Firestore Profile Retrieved:", profile); // DEBUG

    if (profile) {
      const userProfile = profile as import("../utils/zodSchemas").UserProfile;
      const skills = Array.isArray(userProfile.skills) ? userProfile.skills.join(", ") : "Not provided";
      const interests = Array.isArray((userProfile as any).interests) ? (userProfile as any).interests.join(", ") : "Not provided";
      const values = Array.isArray((userProfile as any).values) ? (userProfile as any).values.join(", ") : "Not provided";
      const careerGoals = userProfile.careerGoals ?? "Not provided";

      let jobPreferences = "Not provided";
      if (userProfile.jobPreferences) {
        const jp = userProfile.jobPreferences;
        jobPreferences = [
          Array.isArray(jp.jobTitles) ? `Job Titles: ${jp.jobTitles.join(", ")}` : "",
          Array.isArray(jp.workModels) ? `Work Models: ${jp.workModels.join(", ")}` : "",
          Array.isArray(jp.targetIndustries) ? `Industries: ${jp.targetIndustries.join(", ")}` : ""
        ].filter(Boolean).join("; ") || "Not provided";
      }

      profileContext = `- Skills: ${skills}
- Interests: ${interests}
- Values: ${values}
- Career Goals: ${careerGoals}
- Job Preferences: ${jobPreferences}`;
    }
  } catch (err) {
    console.error("⚠️ Failed to fetch profile:", err);
  }

  // --- Step 2: Combine into a single system prompt ---
  const systemPrompt = new SystemMessage(
    `You are 'Ikigai Guide', a career co-pilot AI. Your primary directive is to provide personalized career advice based *exclusively* on the user's profile data provided below.

**CRITICAL INSTRUCTION: Do NOT ask the user for information that is already present in their profile. Synthesize your answer using the data provided.**

---
**USER PROFILE CONTEXT**
${profileContext}
---

If the profile context is missing or empty, you may ask clarifying questions. Otherwise, use the data to directly answer the user's query.`
  );

  // --- Step 3: Construct full conversation ---
  const fullHistory = [
    systemPrompt,                         // ✅ merged system context
    ...history,                           // past conversation
    new HumanMessage(newMessage.content)  // latest user query
  ];

  console.log("🚀 Final Prompt Sent to Gemini:", JSON.stringify(fullHistory, null, 2)); // DEBUG

  const response = await model.invoke(fullHistory);
  return { aiResponse: response.content.toString() };
};

// ✅ Node 3: Retrieve RAG context from ChromaDB
const retrieveContext = async (state: GraphState): Promise<Partial<GraphState>> => {
  console.log("🔎 Retrieving context from knowledge base...");
  const { newMessage } = state;

  const relevantDocs = await queryRelevant(newMessage.content);

  if (!relevantDocs || relevantDocs.length === 0) {
    return { context: "⚠️ No relevant context found in the knowledge base." };
  }

  const context = relevantDocs.map((doc: { text: string }) => doc.text).join("\n\n---\n\n");
  return { context };
};

// ✅ Node 4: Save Gemini response to Firestore
const saveResponse = async (state: GraphState): Promise<Partial<GraphState>> => {
  const { userId, sessionId, aiResponse } = state;
  if (!aiResponse) {
    throw new Error("AI response is missing, cannot save.");
  }
  await addMessageToSession(userId, sessionId, { role: "ai", content: aiResponse });
  return {};
};

// ✅ StateGraph wiring
const workflow = new StateGraph<GraphState>({
  channels: {
    userId: { value: null as any },
    sessionId: { value: null as any },
    newMessage: { value: null as any },
    history: { value: null as any },
    context: { value: null as any },
    aiResponse: { value: null as any },
  },
});

workflow.addNode("getHistory", getHistory);
workflow.addNode("retrieveContext", retrieveContext);
workflow.addNode("callModel", callModel);
workflow.addNode("saveResponse", saveResponse);

workflow.addEdge(START, "getHistory" as any);
workflow.addEdge("getHistory" as any, "retrieveContext" as any);
workflow.addEdge("retrieveContext" as any, "callModel" as any);
workflow.addEdge("callModel" as any, "saveResponse" as any);
workflow.addEdge("saveResponse" as any, END);

export { workflow };

const app = workflow.compile();

// ✅ Main entry point
export const handleChatMessage = async (
  userId: string,
  sessionId: string,
  newMessage: ChatInput
): Promise<string> => {
  await addMessageToSession(userId, sessionId, { role: "user", content: newMessage.content });

  const initialState: GraphState = {
    userId,
    sessionId,
    newMessage,
    history: [],
  };

  const result = await app.invoke(initialState);
  if (!result.aiResponse) {
    throw new Error("Graph execution failed to produce an AI response.");
  }
  return result.aiResponse;
};
