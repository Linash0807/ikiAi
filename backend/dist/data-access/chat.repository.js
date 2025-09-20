"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessageToSession = addMessageToSession;
exports.getSessionMessages = getSessionMessages;
exports.getUserSessions = getUserSessions;
exports.createNewSession = createNewSession;
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase-admin/firestore");
const getSessionRef = (userId, sessionId) => {
    return firebase_1.firestore
        .collection("users")
        .doc(userId)
        .collection("sessions")
        .doc(sessionId);
};
async function addMessageToSession(userId, sessionId, message) {
    const messagesRef = getSessionRef(userId, sessionId).collection("messages");
    const docRef = await messagesRef.add({
        ...message,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    });
    await getSessionRef(userId, sessionId).set({
        lastUpdatedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    return docRef.id;
}
async function getSessionMessages(userId, sessionId) {
    const messagesRef = getSessionRef(userId, sessionId).collection("messages");
    const snapshot = await messagesRef.orderBy("createdAt", "asc").get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map((doc) => doc.data());
}
async function getUserSessions(userId) {
    const sessionsRef = firebase_1.firestore
        .collection("users")
        .doc(userId)
        .collection("sessions");
    const snapshot = await sessionsRef.orderBy("lastUpdatedAt", "desc").get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map((doc) => ({
        sessionId: doc.id,
        lastUpdatedAt: doc.data().lastUpdatedAt,
    }));
}
async function createNewSession(userId) {
    const sessionsRef = firebase_1.firestore
        .collection("users")
        .doc(userId)
        .collection("sessions");
    const newSessionDoc = await sessionsRef.add({
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        lastUpdatedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return newSessionDoc.id;
}
