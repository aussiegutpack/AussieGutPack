import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import Card from "../../components/ui/Card";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Blog = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollectionRef = collection(db, "content", "blog", "posts");
        const blogSnapshot = await getDocs(blogCollectionRef);
        const blogData = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched blog posts:", blogData); // Debug log
        if (blogData.length > 0) {
          setBlogPosts(blogData);
        } else {
          // Fallback to hardcoded data if Firestore is empty
          setBlogPosts([
            {
              id: "1",
              title: "The Importance of Gut Health",
              date: "January 15, 2025",
            },
            {
              id: "2",
              title: "How to Maintain a Healthy Gut",
              date: "February 3, 2025",
            },
            {
              id: "3",
              title: "The Role of Fiber in Maintaining Gut Health",
              date: "December 15, 2024",
            },
            {
              id: "4",
              title: "Why Gut Health Affects Your Immune System",
              date: "November 10, 2024",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts: " + err.message);
        // Use fallback data on error
        setBlogPosts([
          {
            id: "1",
            title: "The Importance of Gut Health",
            date: "January 15, 2025",
          },
          {
            id: "2",
            title: "How to Maintain a Healthy Gut",
            date: "February 3, 2025",
          },
          {
            id: "3",
            title: "The Role of Fiber in Maintaining Gut Health",
            date: "December 15, 2024",
          },
          {
            id: "4",
            title: "Why Gut Health Affects Your Immune System",
            date: "November 10, 2024",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen container mx-auto p-6 ${
          isDarkMode ? "bg-stone-900" : "bg-white"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Our Blog
        </h1>
        <p
          className={`transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen container mx-auto p-6 ${
          isDarkMode ? "bg-stone-900" : "bg-white"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Our Blog
        </h1>
        <p
          className={`text-red-500 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen container mx-auto p-6 ${
        isDarkMode ? "bg-stone-900" : "bg-white"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Our Blog
      </h1>
      {blogPosts.length === 0 ? (
        <p
          className={`transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          No blog posts available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id}>
              <Card
                title={post.title}
                footer={post.date}
                className="hover:shadow-lg transition-shadow duration-300 ease-in-out"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
