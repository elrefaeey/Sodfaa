// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-5Z9l1YEyeBeOrTt39DT588GLoi3CvoA",
  authDomain: "sodfaa-8f702.firebaseapp.com",
  projectId: "sodfaa-8f702",
  storageBucket: "sodfaa-8f702.firebasestorage.app",
  messagingSenderId: "1078916973743",
  appId: "1:1078916973743:web:76d08cfc1598399695805a",
  measurementId: "G-1GCD0M0KM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export { analytics };
export default app;
