import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import Button from "../../components/ui/Button";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

const BlogPost = () => {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpcoming, setIsUpcoming] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postDocRef = doc(db, "content", "blog", "posts", id);
        const postDocSnap = await getDoc(postDocRef);
        if (postDocSnap.exists()) {
          const postData = { id: postDocSnap.id, ...postDocSnap.data() };
          const currentDate = new Date("2025-04-16T00:00:00Z");
          const publishDate = postData.date ? new Date(postData.date) : null;
          if (publishDate && publishDate > currentDate) {
            setIsUpcoming(true);
          } else {
            setIsUpcoming(false);
          }
          setPost(postData);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  // Format the lastEdited timestamp
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

  // Animation variants for content blocks
  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen container mx-auto px-6 py-12 ${
          isDarkMode ? "bg-stone-900" : "bg-stone-50"
        }`}
      >
        <div className="text-center">
          <ClipLoader color={isDarkMode ? "#f87171" : "b91c1c"} />
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
          className={`text-4xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Error
        </h1>
        <p
          className={`text-lg text-center transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </p>
        <Button
          to="/blog"
          variant="primary"
          className="mt-4 bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Blog
        </Button>
      </div>
    );
  }

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

  if (isUpcoming) {
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
          Coming Soon
        </h1>
        <p
          className={`text-lg transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-300" : "text-stone-600"
          }`}
        >
          This blog post will be available on {formatDate(post.date)}.
        </p>
        <Button
          to="/blog"
          variant="primary"
          className="mt-4 bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
        isDarkMode ? "bg-stone-900" : "bg-stone-50"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div
          className={`relative rounded-xl shadow-lg p-8 mb-12 overflow-hidden border-t-4 ${
            isDarkMode
              ? "bg-gradient-to-r from-stone-800 to-stone-700 border-red-400/50"
              : "bg-gradient-to-r from-white to-stone-100 border-red-800/50"
          }`}
        >
          <h1
            className={`text-4xl md:text-5xl font-extrabold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            {post.title}
          </h1>
          <div
            className={`text-lg transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-stone-400" : "text-stone-500"
            } flex flex-col sm:flex-row sm:items-center sm:space-x-4`}
          >
            <p>Published: {formatDate(post.date)}</p>
            <p>Last Edited: {formatLastEdited(post.lastEdited)}</p>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`prose prose-lg max-w-none transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-200 prose-invert" : "text-stone-700"
          }`}
        >
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={blockVariants}
                className="mb-8"
              >
                {block.type === "paragraph" ? (
                  <p className="leading-relaxed">{block.content}</p>
                ) : block.type === "list" && Array.isArray(block.content) ? (
                  <ol className="list-decimal pl-6 space-y-2">
                    {block.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : block.type === "bullet" && Array.isArray(block.content) ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {block.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : block.type === "image" && block.content ? (
                  <div className="my-6">
                    <img
                      src={block.content}
                      alt="Blog content"
                      className="w-full max-w-lg mx-auto rounded-lg shadow-md"
                    />
                  </div>
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
              </motion.div>
            ))
          ) : (
            <p>No content available.</p>
          )}
        </div>

        {/* Back Button */}
        <Button
          to="/blog"
          variant="primary"
          className={`mt-12 inline-flex items-center px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
            isDarkMode
              ? "bg-red-800 text-white hover:bg-red-900 hover:shadow-lg"
              : "bg-red-800 text-white hover:bg-red-900 hover:shadow-lg"
          }`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Button>
      </div>
    </div>
  );
};

export default BlogPost;
