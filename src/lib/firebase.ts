// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm-HZXECJxzTeNcrwkg1Z3cCpsXqKwjBY",
  authDomain: "finsim-afbf4.firebaseapp.com",
  projectId: "finsim-afbf4",
  storageBucket: "finsim-afbf4.appspot.com",
  messagingSenderId: "126971831090",
  appId: "1:126971831090:web:1701f6ee4de6f68d4f6d2b",
  measurementId: "G-3Z7G7WFFEX"
};


// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
