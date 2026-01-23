import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZY9zzfcElxpawyfXV2GYSTSbz1LqZUkc",
  authDomain: "untold-words.firebaseapp.com",
  projectId: "untold-words",
  storageBucket: "untold-words.firebasestorage.app",
  messagingSenderId: "382300124639",
  appId: "1:382300124639:web:f0460dddf928dffef9c06a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
