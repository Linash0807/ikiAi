"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertUserProfile = upsertUserProfile;
exports.getUserProfile = getUserProfile;
exports.getPrimaryRoadmap = getPrimaryRoadmap;
const firebase_1 = require("../config/firebase");
const getUserRef = (userId) => firebase_1.firestore.collection("users").doc(userId);
// This function can create or update the profile
async function upsertUserProfile(userId, profileData) {
    await getUserRef(userId).set(profileData, { merge: true });
}
async function getUserProfile(userId) {
    const doc = await getUserRef(userId).get();
    if (!doc.exists) {
        return null;
    }
    return doc.data();
}
// Returns the user's primary roadmap (for onboarding or main career path)
async function getPrimaryRoadmap(userId) {
    const roadmapsRef = firebase_1.firestore.collection(`users/${userId}/roadmaps`);
    const snapshot = await roadmapsRef.orderBy("createdAt", "asc").limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].data();
}
