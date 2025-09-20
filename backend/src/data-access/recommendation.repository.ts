import { firestore } from "../config/firebase";
import { RecommendationOutput } from "../utils/zodSchemas";
import { FieldValue } from "firebase-admin/firestore"; // Import FieldValue

export async function saveRecommendation(
  userId: string,
  sessionId: string,
  recommendation: RecommendationOutput
) {
  // 1. Corrected Firestore path
  const ref = firestore
    .collection("recommendations")
    .doc(userId)
    .collection("sessions")
    .doc(sessionId);

  await ref.set({
    ...recommendation,
    // 2. Corrected server timestamp
    createdAt: FieldValue.serverTimestamp(),
  });

  return { sessionId };
}


