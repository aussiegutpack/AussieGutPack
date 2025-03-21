import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import Card from "../../components/ui/Card";

const Blog = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const blogPosts = [
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
  ];

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
    </div>
  );
};

export default Blog;
