// src/pages/content/Blog.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import Card from "../../components/ui/Card";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { ClipLoader } from "react-spinners";

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
          blocks: doc.data().blocks || [{ type: "paragraph", content: "" }],
          lastEdited: doc.data().lastEdited || "",
        }));
        console.log("Fetched blog posts:", blogData);
        if (blogData.length > 0) {
          const sortedBlogData = blogData.sort((a, b) => {
            const lastEditedA = a.lastEdited
              ? new Date(a.lastEdited)
              : new Date(0);
            const lastEditedB = b.lastEdited
              ? new Date(b.lastEdited)
              : new Date(0);
            return lastEditedB - lastEditedA;
          });
          setBlogPosts(sortedBlogData);
        } else {
          setBlogPosts([]);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  // Format the lastEdited timestamp (without seconds)
  const formatLastEdited = (timestamp) => {
    if (!timestamp) return "Never edited";
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getExcerpt = (post) => {
    if (!post.blocks || post.blocks.length === 0) return "Read more...";
    const firstTextBlock = post.blocks.find(
      (block) =>
        block.type === "paragraph" ||
        block.type === "list" ||
        block.type === "bullet"
    );
    if (!firstTextBlock) return "Read more...";
    if (firstTextBlock.type === "paragraph") {
      return firstTextBlock.content.split(" ").slice(0, 15).join(" ") + "...";
    } else if (Array.isArray(firstTextBlock.content)) {
      return (
        firstTextBlock.content[0] +
        (firstTextBlock.content.length > 1 ? "..." : "")
      );
    }
    return "Read more...";
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen container mx-auto px-6 py-12 ${
          isDarkMode ? "bg-stone-900" : "bg-stone-50"
        }`}
      >
        <h1
          className={`text-4xl font-bold mb-8 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Our Blog
        </h1>
        <div className="text-center">
          <ClipLoader color={isDarkMode ? "#f87171" : "#b91c1c"} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen container mx-auto px-6 py-12 ${
          isDarkMode ? "bg-stone-900" : "bg-stone-50"
        }`}
      >
        <h1
          className={`text-4xl font-bold mb-8 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Our Blog
        </h1>
        <p
          className={`text-lg text-center transition-colors duration-300 ease-in-out ${
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
      className={`min-h-screen container mx-auto px-6 py-12 ${
        isDarkMode ? "bg-stone-900" : "bg-stone-50"
      }`}
    >
      <h1
        className={`text-4xl font-bold mb-8 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Our Blog
      </h1>
      {blogPosts.length === 0 ? (
        <p
          className={`text-lg transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-300" : "text-stone-600"
          }`}
        >
          No blog posts available yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="block group">
              <Card
                title={post.title}
                footer={
                  <span
                    className={`text-sm transition-colors duration-300 ease-in-out ${
                      isDarkMode ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    Last Edited: {formatLastEdited(post.lastEdited)}
                  </span>
                }
                content={
                  <p
                    className={`text-base transition-colors duration-300 ease-in-out ${
                      isDarkMode ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {getExcerpt(post)}
                  </p>
                }
                className={`p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                  isDarkMode
                    ? "bg-stone-800 hover:bg-stone-700"
                    : "bg-white hover:bg-stone-100"
                } group-hover:shadow-lg`}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
