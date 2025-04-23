// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Verify required config values
const requiredFields = ["apiKey", "authDomain", "projectId"] as const;
for (const field of requiredFields) {
  if (!firebaseConfig[field]) {
    console.error(`Firebase ${field} is not configured`);
    throw new Error(`Firebase ${field} is required but not provided`);
  }
}

console.log("Initializing Firebase with config:", {
  apiKey: firebaseConfig.apiKey?.slice(0, 5) + "...",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
let app;
let auth: Auth;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    app = getApp();
    console.log("Using existing Firebase instance");
  }

  // Initialize Auth
  auth = getAuth(app);
  console.log("Firebase Auth initialized successfully");

  // Use Auth Emulator if in development
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"
  ) {
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log("Using Firebase Auth Emulator");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Test auth configuration
const testAuth = async () => {
  try {
    console.log("Testing Firebase Auth configuration...");
    if (auth && auth.config && auth.config.authDomain) {
      console.log("Auth domain verified:", auth.config.authDomain);
    } else {
      console.error("Auth domain verification failed");
    }
  } catch (error) {
    console.error("Firebase Auth configuration error:", error);
  }
};

// Run the test but don't block initialization
testAuth().catch((err) => console.error("Auth test failed:", err));

export { app, auth };
