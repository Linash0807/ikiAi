"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRecommendation = saveRecommendation;
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase-admin/firestore"); // Import FieldValue
async function saveRecommendation(userId, sessionId, recommendation) {
    // 1. Corrected Firestore path
    const ref = firebase_1.firestore
        .collection("recommendations")
        .doc(userId)
        .collection("sessions")
        .doc(sessionId);
    await ref.set({
        ...recommendation,
        // 2. Corrected server timestamp
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { sessionId };
}
