import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../App";
import { useCart } from "../../context/CartContext";
import { auth, db } from "../../firebase";
import { doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";

function ProductDetail() {
  const { id } = useParams(); // Get product ID from URL
  const { isDarkMode } = useContext(ThemeContext);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch product and reviews
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        // Fetch product
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          console.error("Product not found");
          navigate("/products"); // Redirect if product not found
        }

        // Fetch reviews
        const reviewsRef = collection(db, "products", id, "reviews");
        const reviewsSnap = await getDocs(reviewsRef);
        const reviewsList = reviewsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);

        // Calculate average rating
        if (reviewsList.length > 0) {
          const totalRating = reviewsList.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          setAverageRating(totalRating / reviewsList.length);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching product or reviews:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id, navigate]);

  // Handle star rating hover and click
  const handleStarHover = (star) => {
    setNewRating(star);
  };

  const handleStarClick = (star) => {
    setNewRating(star);
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to submit a review.");
      return;
    }
    if (newRating < 1 || newRating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }
    if (!newComment.trim()) {
      alert("Please enter a review comment.");
      return;
    }

    try {
      const reviewData = {
        rating: newRating,
        comment: newComment,
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
      };

      const reviewsRef = collection(db, "products", id, "reviews");
      await addDoc(reviewsRef, reviewData);

      // Update reviews state
      setReviews([...reviews, reviewData]);
      // Recalculate average rating
      const totalRating = [...reviews, reviewData].reduce(
        (sum, review) => sum + review.rating,
        0
      );
      setAverageRating(totalRating / (reviews.length + 1));
      // Reset form
      setNewRating(0);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!product) {
    return null; // Shouldn't reach here due to redirect
  }

  return (
    <div
      className={`min-h-screen container mx-auto px-6 py-12 ${
        isDarkMode ? "bg-stone-900" : "bg-stone-50"
      }`}
    >
      <button
        onClick={() => navigate("/products")}
        className={`mb-6 text-sm font-semibold transition-colors duration-300 ease-in-out ${
          isDarkMode
            ? "text-red-400 hover:text-red-500"
            : "text-red-600 hover:text-red-800"
        }`}
      >
        ← Back to Products
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-md"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200.png?text=No+Image";
              console.error(`Failed to load image for ${product.name}`);
            }}
          />
        </div>
        {/* Product Details */}
        <div className="md:w-1/2">
          <h1
            className={`text-3xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-red-600"
            }`}
          >
            {product.name}
          </h1>
          <p
            className={`text-lg mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-stone-300" : "text-stone-600"
            }`}
          >
            {product.description}
          </p>
          <p
            className={`text-xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-stone-300" : "text-stone-600"
            }`}
          >
            Price: ${product.price.toFixed(2)}
          </p>
          {/* Average Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.971c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.971a1 1 0 00-.364-1.118L2.31 9.397c-.784-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ))}
            </div>
            <span
              className={`ml-2 text-sm transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-stone-300" : "text-stone-600"
              }`}
            >
              ({averageRating.toFixed(1)} from {reviews.length} reviews)
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="bg-red-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-900 active:bg-red-950 transition-all duration-300 ease-in-out"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2
          className={`text-2xl font-semibold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Customer Reviews
        </h2>

        {/* Submit Review Form */}
        <div
          className={`p-6 border rounded-md mb-8 ${
            isDarkMode
              ? "border-stone-600 bg-stone-800"
              : "border-red-300 bg-white"
          }`}
        >
          <h3
            className={`text-lg font-medium mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-red-600"
            }`}
          >
            Write a Review
          </h3>
          {user ? (
            <form onSubmit={handleSubmitReview}>
              {/* Star Rating */}
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={() => handleStarHover(newRating)}
                    onClick={() => handleStarClick(star)}
                    className={`w-8 h-8 cursor-pointer ${
                      star <= newRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.971c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.971a1 1 0 00-.364-1.118L2.31 9.397c-.784-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                  </svg>
                ))}
              </div>
              {/* Comment */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review here..."
                className={`w-full p-3 border rounded-md focus:outline-none transition-all duration-300 ease-in-out mb-4 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-white placeholder-stone-400 focus:ring-red-500 focus:border-red-500"
                    : "bg-white border-red-300 text-red-600 placeholder-stone-400 focus:ring-red-500 focus:border-red-500"
                }`}
                rows="4"
              ></textarea>
              <button
                type="submit"
                className="bg-red-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-900 active:bg-red-950 transition-all duration-300 ease-in-out"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p
              className={`text-sm transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Please{" "}
              <a href="/login" className="text-red-600 hover:underline">
                sign in
              </a>{" "}
              to write a review.
            </p>
          )}
        </div>

        {/* Display Reviews */}
        {reviews.length === 0 ? (
          <p
            className={`text-sm transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-stone-300" : "text-stone-600"
            }`}
          >
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`p-4 border rounded-md ${
                  isDarkMode
                    ? "border-stone-600 bg-stone-800"
                    : "border-red-300 bg-white"
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.971c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.971a1 1 0 00-.364-1.118L2.31 9.397c-.784-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className={`ml-2 text-sm transition-colors duration-300 ease-in-out ${
                      isDarkMode ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {new Date(review.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p
                  className={`text-sm transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  {review.comment}
                </p>
                <p
                  className={`text-xs mt-2 transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  By: {review.userEmail}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
