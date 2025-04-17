const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Replace with the path to your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Replace this URL with your deployed app's public folder URL where UW_placeholder.jpg is hosted
const IMAGE_URL = "https://your-vercel-app.vercel.app/UW_placeholder.jpg"; // Update this with your actual Vercel app URL

async function updateProductImages() {
  try {
    // Fetch all products from Firestore
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      console.log("No products found in Firestore.");
      return;
    }

    // Update each product with the new image URL
    const batch = db.batch();
    snapshot.forEach((doc) => {
      const productRef = productsRef.doc(doc.id);
      batch.update(productRef, { image: IMAGE_URL });
    });

    // Commit the batch update
    await batch.commit();
    console.log(
      `${snapshot.size} products updated with new image URL: ${IMAGE_URL}`
    );
  } catch (error) {
    console.error("Error updating product images:", error);
  } finally {
    // Close the Firestore connection
    admin.app().delete();
  }
}

// Run the script
updateProductImages();
