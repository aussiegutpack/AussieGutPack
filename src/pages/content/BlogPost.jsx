// src/pages/content/BlogPost.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import Button from "../../components/ui/Button";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const BlogPost = () => {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postDocRef = doc(db, "content", "blog", "posts", id);
      const postDocSnap = await getDoc(postDocRef);
      if (postDocSnap.exists()) {
        setPost({ id: postDocSnap.id, ...postDocSnap.data() });
      } else {
        setPost(null); // No fallback, just show "Post Not Found"
      }
    };
    fetchPost();
  }, [id]);

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
    }); // e.g., "4/3/2025, 4:11 PM"
  };

  if (!post) {
    return (
      <div
        className={`min-h-screen container mx-auto px-6 py-12 ${
          isDarkMode ? "bg-stone-900" : "bg-stone-50"
        }`}
      >
        <h1
          className={`text-4xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Post Not Found
        </h1>
        <Button
          to="/blog"
          variant="primary"
          className="bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen container mx-auto px-6 py-12 ${
        isDarkMode ? "bg-stone-900" : "bg-stone-50"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h1
          className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          {post.title}
        </h1>
        <p
          className={`text-lg mb-8 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-400" : "text-stone-500"
          }`}
        >
          Last Edited: {formatLastEdited(post.lastEdited)}
        </p>
        <div
          className={`prose prose-lg max-w-none transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-200 prose-invert" : "text-stone-700"
          }`}
        >
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block, index) => (
              <div key={index} className="mb-6">
                {block.type === "paragraph" ? (
                  <p>{block.content}</p>
                ) : block.type === "list" && Array.isArray(block.content) ? (
                  <ol className="list-decimal pl-6 space-y-2">
                    {block.content.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ol>
                ) : block.type === "bullet" && Array.isArray(block.content) ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {block.content.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : block.type === "image" && block.content ? (
                  <img
                    src={block.content}
                    alt="Blog content"
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                ) : block.type === "link" && block.content.url ? (
                  <Link
                    to={block.content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`underline transition-colors duration-300 ease-in-out ${
                      isDarkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-500"
                    }`}
                  >
                    {block.content.text || block.content.url}
                  </Link>
                ) : (
                  <p className="text-red-500">Invalid block format</p>
                )}
              </div>
            ))
          ) : (
            <p>No content available.</p>
          )}
        </div>
        <Button
          to="/blog"
          variant="primary"
          className="mt-8 bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Blog
        </Button>
      </div>
    </div>
  );
};

export default BlogPost;
