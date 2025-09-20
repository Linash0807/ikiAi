import { firestore } from "../config/firebase";
import { UserProfile } from "../utils/zodSchemas";

const getUserRef = (userId: string) => firestore.collection("users").doc(userId);

// This function can create or update the profile
export async function upsertUserProfile(userId: string, profileData: Partial<UserProfile>) {
  await getUserRef(userId).set(profileData, { merge: true });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const doc = await getUserRef(userId).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as UserProfile;
}

// Returns the user's primary roadmap (for onboarding or main career path)
export async function getPrimaryRoadmap(userId: string): Promise<any | null> {
  const roadmapsRef = firestore.collection(`users/${userId}/roadmaps`);
  const snapshot = await roadmapsRef.orderBy("createdAt", "asc").limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].data();
}

