import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function readServiceAccount() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  let serviceAccount = {};

  if (rawServiceAccount) {
    try {
      serviceAccount = JSON.parse(rawServiceAccount);
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT must contain valid JSON.");
    }
  }

  const projectId = serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = serviceAccount.client_email || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (serviceAccount.private_key || process.env.FIREBASE_PRIVATE_KEY)
    ?.replace(/\\n/g, "\n");
  const missing = [
    !projectId && "project ID (FIREBASE_PROJECT_ID or service account project_id)",
    !clientEmail && "client email (FIREBASE_CLIENT_EMAIL or service account client_email)",
    !privateKey && "private key (FIREBASE_PRIVATE_KEY or service account private_key)",
  ].filter(Boolean);

  if (missing.length) {
    throw new Error(`Firebase is not configured. Set ${missing.join(", ")} in the deployment environment.`);
  }

  return { projectId, clientEmail, privateKey };
}

// Initialize only when a request actually needs Firestore. This keeps builds
// from failing during route discovery when production secrets are not present.
export function getDatabase() {
  const app = getApps()[0] || initializeApp({ credential: cert(readServiceAccount()) });
  return getFirestore(app);
}
