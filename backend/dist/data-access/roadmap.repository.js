"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRoadmap = saveRoadmap;
exports.updateTaskStatus = updateTaskStatus;
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase-admin/firestore");
async function saveRoadmap(userId, roadmapData) {
    const docRef = firebase_1.firestore.collection(`users/${userId}/roadmaps`).doc();
    await docRef.set({
        ...roadmapData,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        completedTasks: [],
    });
    return docRef.id;
}
async function updateTaskStatus(userId, roadmapId, task, isCompleted) {
    const docRef = firebase_1.firestore.doc(`users/${userId}/roadmaps/${roadmapId}`);
    if (isCompleted) {
        await docRef.update({
            completedTasks: firestore_1.FieldValue.arrayUnion(task),
        });
    }
    else {
        await docRef.update({
            completedTasks: firestore_1.FieldValue.arrayRemove(task),
        });
    }
}
