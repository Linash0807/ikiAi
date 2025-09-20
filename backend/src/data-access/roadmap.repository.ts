import { firestore } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function saveRoadmap(userId: string, roadmapData: any) {
  const docRef = firestore.collection(`users/${userId}/roadmaps`).doc();
  await docRef.set({
    ...roadmapData,
    createdAt: FieldValue.serverTimestamp(),
    completedTasks: [],
  });
  return docRef.id;
}

export async function updateTaskStatus(userId: string, roadmapId: string, task: string, isCompleted: boolean) {
  const docRef = firestore.doc(`users/${userId}/roadmaps/${roadmapId}`);
  if (isCompleted) {
    await docRef.update({
      completedTasks: FieldValue.arrayUnion(task),
    });
  } else {
    await docRef.update({
      completedTasks: FieldValue.arrayRemove(task),
    });
  }
}

