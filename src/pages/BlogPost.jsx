import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ThemeContext } from "../App";

const BlogPost = () => {
  const { id } = useParams(); // Get the blog post ID from the URL
  const { isDarkMode } = useContext(ThemeContext); // Access theme

  // Sample blog post data (replace with your actual data source, e.g., API or state)
  const blogPosts = [
    {
      id: "1",
      title: "The Importance of Gut Health",
      date: "January 15, 2025",
      content:
        "Gut health is crucial for overall well-being. A balanced gut microbiome supports digestion, immunity, and mental health.",
    },
    {
      id: "2",
      title: "How to Maintain a Healthy Gut",
      date: "February 3, 2025",
      content:
        "Maintaining a healthy gut involves a diet rich in fiber, probiotics, and hydration.",
    },
    {
      id: "3",
      title: "The Role of Fiber in Maintaining Gut Health",
      date: "December 15, 2024",
      content:
        "Fiber acts as fuel for gut bacteria, promoting a healthy digestive system.",
    },
    {
      id: "4",
      title: "Why Gut Health Affects Your Immune System",
      date: "November 10, 2024",
      content:
        "A healthy gut strengthens your immune system by supporting beneficial bacteria.",
    },
  ];

  // Find the post matching the ID
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold">Post Not Found</h1>
        <Link
          to="/blog"
          className={`mt-4 inline-block px-6 py-3 rounded-lg text-white transition-colors ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-32">
      <h1
        className={`text-3xl font-bold mb-4 ${
          isDarkMode ? "text-purple-300" : "text-purple-900"
        }`}
      >
        {post.title}
      </h1>
      <p
        className={`text-gray-600 mb-4 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {post.date}
      </p>
      <p
        className={`text-lg mb-6 ${
          isDarkMode ? "text-gray-300" : "text-gray-800"
        }`}
      >
        {post.content}
      </p>
      <Link
        to="/blog"
        className={`inline-block px-6 py-3 rounded-lg text-white transition-colors ${
          isDarkMode
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        Back to Blog
      </Link>
    </div>
  );
};

export default BlogPost;
