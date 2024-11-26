import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
