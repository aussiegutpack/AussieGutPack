// src/pages/content/BlogPost.js
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        // Fallback to hardcoded if not in Firestore yet
        const fallbackPosts = [
          {
            id: "1",
            title: "The Importance of Gut Health",
            date: "January 15, 2025",
            blocks: [
              {
                type: "paragraph",
                content:
                  "Gut health is crucial for overall well-being. It affects digestion, immunity, and even mental health.",
              },
              {
                type: "list",
                content: [
                  "Eat a balanced diet.",
                  "Stay hydrated.",
                  "Get regular exercise.",
                ],
              },
              {
                type: "paragraph",
                content:
                  "A healthy gut can prevent chronic diseases and improve your quality of life.",
              },
            ],
          },
        ];
        setPost(fallbackPosts.find((p) => p.id === id) || null);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
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
          Post Not Found
        </h1>
        <Button
          to="/blog"
          variant="primary"
          className="bg-red-800 text-white hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Blog
        </Button>
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
        className={`text-3xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        {post.title}
      </h1>
      <p
        className={`mb-4 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-white" : "text-red-600"
        }`}
      >
        {post.date}
      </p>
      <div
        className={`text-lg mb-6 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-white" : "text-red-600"
        }`}
      >
        {post.blocks && post.blocks.length > 0 ? (
          post.blocks.map((block, index) => (
            <div key={index} className="mb-4">
              {block.type === "paragraph" ? (
                <p>{block.content}</p>
              ) : block.type === "list" && Array.isArray(block.content) ? (
                <ol className="list-decimal pl-6">
                  {block.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="mb-2">
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Invalid block format</p>
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
        className="bg-red-800 text-white hover:bg-red-900 transition-colors duration-300 ease-in-out"
      >
        Back to Blog
      </Button>
    </div>
  );
};

export default BlogPost;
