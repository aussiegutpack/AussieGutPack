// src/pages/content/BlogPost.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../App";
import Button from "../../components/ui/Button";

const BlogPost = () => {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);

  const blogPosts = [
    {
      id: "1",
      title: "The Importance of Gut Health",
      date: "January 15, 2025",
      content: "Gut health is crucial for overall well-being...",
    },
    {
      id: "2",
      title: "How to Maintain a Healthy Gut",
      date: "February 3, 2025",
      content: "Maintaining a healthy gut involves a diet rich in fiber...",
    },
    {
      id: "3",
      title: "The Role of Fiber in Maintaining Gut Health",
      date: "December 15, 2024",
      content: "Fiber acts as fuel for gut bacteria...",
    },
    {
      id: "4",
      title: "Why Gut Health Affects Your Immune System",
      date: "November 10, 2024",
      content: "A healthy gut strengthens your immune system...",
    },
  ];

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <h1
          className={`text-3xl font-bold mb-6 ${
            isDarkMode ? "text-green-300" : "text-green-900"
          }`}
        >
          Post Not Found
        </h1>
        <Button to="/blog" variant="primary">
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1
        className={`text-3xl font-bold mb-4 ${
          isDarkMode ? "text-green-300" : "text-green-900"
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
      <Button to="/blog" variant="primary">
        Back to Blog
      </Button>
    </div>
  );
};

export default BlogPost;
