// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // if you use storage
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjVDbvzmbogD_lbGqB4MmVf3aTnTQzEh8",
  authDomain: "aussie-gut-pack-a896e.firebaseapp.com",
  projectId: "aussie-gut-pack-a896e",
  storageBucket: "aussie-gut-pack-a896e.firebasestorage.app",
  messagingSenderId: "817190270687",
  appId: "1:817190270687:web:357c740b79d6e243e3db6a",
  measurementId: "G-NEV6BN8ZKT"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // if you use storage