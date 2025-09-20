import { firestore } from "../config/firebase";
import { ChatMessage } from "../utils/zodSchemas";
import { FieldValue } from "firebase-admin/firestore";

const getSessionRef = (userId: string, sessionId: string) => {
  return firestore
    .collection("users")
    .doc(userId)
    .collection("sessions")
    .doc(sessionId);
};

export async function addMessageToSession(
  userId: string,
  sessionId: string,
  message: ChatMessage
) {
  const messagesRef = getSessionRef(userId, sessionId).collection("messages");
  const docRef = await messagesRef.add({
    ...message,
    createdAt: FieldValue.serverTimestamp(),
  });

  await getSessionRef(userId, sessionId).set(
    {
      lastUpdatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return docRef.id;
}

export async function getSessionMessages(userId: string, sessionId: string): Promise<ChatMessage[]> {
  const messagesRef = getSessionRef(userId, sessionId).collection("messages");
  const snapshot = await messagesRef.orderBy("createdAt", "asc").get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc) => doc.data() as ChatMessage);
}

export async function getUserSessions(userId: string) {
  const sessionsRef = firestore
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

export async function createNewSession(userId: string) {
  const sessionsRef = firestore
    .collection("users")
    .doc(userId)
    .collection("sessions");

  const newSessionDoc = await sessionsRef.add({
    createdAt: FieldValue.serverTimestamp(),
    lastUpdatedAt: FieldValue.serverTimestamp(),
  });

  return newSessionDoc.id;
}


