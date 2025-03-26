// src/pages/content/Blog.js
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
          title: doc.data().title,
          date: doc.data().date,
          blocks: doc.data().blocks || [{ type: "paragraph", content: "" }],
        }));
        console.log("Fetched blog posts:", blogData);
        if (blogData.length > 0) {
          setBlogPosts(blogData);
        } else {
          setBlogPosts([
            {
              id: "1",
              title: "The Importance of Gut Health",
              date: "January 15, 2025",
              blocks: [
                {
                  type: "paragraph",
                  content: "Gut health is crucial for overall well-being...",
                },
                {
                  type: "list",
                  content: ["Eat well", "Stay active"],
                },
              ],
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts: " + err.message);
        setBlogPosts([
          {
            id: "1",
            title: "The Importance of Gut Health",
            date: "January 15, 2025",
            blocks: [
              {
                type: "paragraph",
                content: "Gut health is crucial for overall well-being...",
              },
              {
                type: "list",
                content: ["Eat well", "Stay active"],
              },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  const getExcerpt = (post) => {
    if (!post.blocks || post.blocks.length === 0) return "Read more...";
    const firstBlock = post.blocks[0];
    if (firstBlock.type === "paragraph") {
      return firstBlock.content.split(" ").slice(0, 20).join(" ") + "...";
    } else if (
      firstBlock.type === "list" &&
      Array.isArray(firstBlock.content)
    ) {
      return (
        firstBlock.content[0] + (firstBlock.content.length > 1 ? "..." : "")
      );
    }
    return "Read more...";
  };

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
                content={getExcerpt(post)}
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
