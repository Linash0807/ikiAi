"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatMessage = exports.workflow = void 0;
const langgraph_1 = require("@langchain/langgraph");
const google_genai_1 = require("@langchain/google-genai");
const messages_1 = require("@langchain/core/messages");
const chat_repository_1 = require("../data-access/chat.repository");
const vectorstore_service_1 = require("../services/vectorstore.service");
const user_repository_1 = require("../data-access/user.repository");
const model = new google_genai_1.ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
    model: "gemini-1.5-flash",
});
// ✅ Node 1: Retrieve chat history from Firestore
const getHistory = async (state) => {
    const { userId, sessionId } = state;
    const messages = await (0, chat_repository_1.getSessionMessages)(userId, sessionId);
    const history = messages.map((msg) => msg.role === "user" ? new messages_1.HumanMessage(msg.content) : new messages_1.AIMessage(msg.content));
    return { history };
};
// ✅ Node 2: Call Gemini with injected profile + RAG context
const callModel = async (state) => {
    const { history, newMessage, context, userId } = state;
    // --- Step 1: Fetch Firestore Profile ---
    let profileContext = "⚠️ No user profile found in Firestore.";
    try {
        const profile = await (0, user_repository_1.getUserProfile)(userId);
        console.log("🔥 Firestore Profile Retrieved:", profile); // DEBUG
        if (profile) {
            const userProfile = profile;
            const skills = Array.isArray(userProfile.skills) ? userProfile.skills.join(", ") : "Not provided";
            const interests = Array.isArray(userProfile.interests) ? userProfile.interests.join(", ") : "Not provided";
            const values = Array.isArray(userProfile.values) ? userProfile.values.join(", ") : "Not provided";
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
    }
    catch (err) {
        console.error("⚠️ Failed to fetch profile:", err);
    }
    // --- Step 2: Combine into a single system prompt ---
    const systemPrompt = new messages_1.SystemMessage(`You are 'Ikigai Guide', a career co-pilot AI. Your primary directive is to provide personalized career advice based *exclusively* on the user's profile data provided below.

**CRITICAL INSTRUCTION: Do NOT ask the user for information that is already present in their profile. Synthesize your answer using the data provided.**

---
**USER PROFILE CONTEXT**
${profileContext}
---

If the profile context is missing or empty, you may ask clarifying questions. Otherwise, use the data to directly answer the user's query.`);
    // --- Step 3: Construct full conversation ---
    const fullHistory = [
        systemPrompt, // ✅ merged system context
        ...history, // past conversation
        new messages_1.HumanMessage(newMessage.content) // latest user query
    ];
    console.log("🚀 Final Prompt Sent to Gemini:", JSON.stringify(fullHistory, null, 2)); // DEBUG
    const response = await model.invoke(fullHistory);
    return { aiResponse: response.content.toString() };
};
// ✅ Node 3: Retrieve RAG context from ChromaDB
const retrieveContext = async (state) => {
    console.log("🔎 Retrieving context from knowledge base...");
    const { newMessage } = state;
    const relevantDocs = await (0, vectorstore_service_1.queryRelevant)(newMessage.content);
    if (!relevantDocs || relevantDocs.length === 0) {
        return { context: "⚠️ No relevant context found in the knowledge base." };
    }
    const context = relevantDocs.map((doc) => doc.text).join("\n\n---\n\n");
    return { context };
};
// ✅ Node 4: Save Gemini response to Firestore
const saveResponse = async (state) => {
    const { userId, sessionId, aiResponse } = state;
    if (!aiResponse) {
        throw new Error("AI response is missing, cannot save.");
    }
    await (0, chat_repository_1.addMessageToSession)(userId, sessionId, { role: "ai", content: aiResponse });
    return {};
};
// ✅ StateGraph wiring
const workflow = new langgraph_1.StateGraph({
    channels: {
        userId: { value: null },
        sessionId: { value: null },
        newMessage: { value: null },
        history: { value: null },
        context: { value: null },
        aiResponse: { value: null },
    },
});
exports.workflow = workflow;
workflow.addNode("getHistory", getHistory);
workflow.addNode("retrieveContext", retrieveContext);
workflow.addNode("callModel", callModel);
workflow.addNode("saveResponse", saveResponse);
workflow.addEdge(langgraph_1.START, "getHistory");
workflow.addEdge("getHistory", "retrieveContext");
workflow.addEdge("retrieveContext", "callModel");
workflow.addEdge("callModel", "saveResponse");
workflow.addEdge("saveResponse", langgraph_1.END);
const app = workflow.compile();
// ✅ Main entry point
const handleChatMessage = async (userId, sessionId, newMessage) => {
    await (0, chat_repository_1.addMessageToSession)(userId, sessionId, { role: "user", content: newMessage.content });
    const initialState = {
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
exports.handleChatMessage = handleChatMessage;
