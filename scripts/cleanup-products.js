import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupProducts() {
  try {
    // Fetch all products
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products = productsSnapshot.docs;

    // Default image URL (larger placeholder for better display)
    const defaultImage =
      "https://via.placeholder.com/300x200.png?text=No+Image";

    // Update each product
    for (const productDoc of products) {
      const productData = productDoc.data();
      const updates = {};

      // Remove color and size fields (if still present)
      if ("color" in productData) updates.color = null;
      if ("size" in productData) updates.size = null;

      // Set default image if missing or if it's the old placeholder
      if (
        !productData.image ||
        productData.image === "https://via.placeholder.com/80"
      ) {
        updates.image = defaultImage;
        console.log(`Set default image for product ${productDoc.id}`);
      }

      // Apply updates if there are any
      if (Object.keys(updates).length > 0) {
        const productRef = doc(db, "products", productDoc.id);
        await updateDoc(productRef, updates);
        console.log(`Updated product ${productDoc.id}`);
      }
    }

    console.log("Cleanup and image update complete!");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

cleanupProducts();
