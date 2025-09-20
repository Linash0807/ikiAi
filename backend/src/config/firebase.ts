import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Get the required environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;

// 1. Add a check to ensure all required variables are present
if (!projectId || !clientEmail || !privateKeyBase64) {
  throw new Error("Missing Firebase Admin SDK credentials in .env file.");
}

// 2. Decode the private key from Base64. Use 'ascii' for keys.
const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('ascii');

// 3. The check for `admin.apps.length` is often not needed in modern setups
admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

// Export individual services for better code completion
export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

