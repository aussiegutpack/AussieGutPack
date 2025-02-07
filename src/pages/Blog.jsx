import React from "react";
import { Link } from "react-router-dom";

const Blog = () => {
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300"
          >
            <Link to={`/blog/${post.id}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
            </Link>
            <p className="text-gray-600">{post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
