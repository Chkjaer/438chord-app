import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyClA3NPBpx757HyxLc8jKJuNhbD16LfHNI",
  authDomain: "chord-app-97a70.firebaseapp.com",
  projectId: "chord-app-97a70",
  storageBucket: "chord-app-97a70.firebasestorage.app",
  messagingSenderId: "257084500842",
  appId: "1:257084500842:web:e1786870c7496bf6ac1313"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);