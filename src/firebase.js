import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
