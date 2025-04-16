import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import Card from "../../components/ui/Card";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

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
          date: doc.data().date || "",
          lastEdited: doc.data().lastEdited || "",
          image:
            doc.data().blocks?.find((block) => block.type === "image")
              ?.content || "",
        }));
        console.log("Fetched blog posts:", blogData);

        if (blogData.length > 0) {
          // Sort by date (newest first, invalid dates at the bottom)
          const sortedBlogData = blogData.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : null;
            const dateB = b.date ? new Date(b.date) : null;

            // Log the dates for debugging
            console.log(
              `Sorting: ${a.title} (${a.date}) -> ${dateA}, ${b.title} (${b.date}) -> ${dateB}`
            );

            // Handle invalid dates by pushing them to the bottom
            if (!dateA || isNaN(dateA.getTime())) return 1; // a is invalid, push to bottom
            if (!dateB || isNaN(dateB.getTime())) return -1; // b is invalid, push to bottom
            return dateB - dateA; // Newest first
          });
          console.log("Sorted blog posts:", sortedBlogData);
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

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
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
    if (isNaN(date.getTime())) return "Invalid Timestamp";
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

  // Check if the blog post is upcoming
  const isUpcoming = (post) => {
    if (!post.date) return false;
    const currentDate = new Date("2025-04-16T00:00:00Z");
    const publishDate = new Date(post.date);
    if (isNaN(publishDate.getTime())) return false;
    return publishDate > currentDate;
  };

  // Animation variants for blog cards
  const cardVariants = {
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
        <h1
          className={`text-4xl md:text-5xl font-extrabold mb-12 text-center transition-colors duration-300 ease-in-out ${
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
          className={`text-4xl md:text-5xl font-extrabold mb-12 text-center transition-colors duration-300 ease-in-out ${
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
        className={`text-4xl md:text-5xl font-extrabold mb-12 text-center transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Our Blog
      </h1>
      {blogPosts.length === 0 ? (
        <p
          className={`text-lg text-center transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-300" : "text-stone-600"
          }`}
        >
          No blog posts available yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {blogPosts.map((post, index) => {
              const upcoming = isUpcoming(post);
              return (
                <motion.div
                  key={post.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="group"
                >
                  {upcoming ? (
                    <Card
                      title={
                        <span className="flex items-center">
                          <span
                            className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${
                              isDarkMode ? "text-stone-300" : "text-stone-700"
                            } group-hover:underline`}
                          >
                            {post.title}
                          </span>
                          <span
                            className={`ml-2 text-sm italic transition-colors duration-300 ease-in-out ${
                              isDarkMode ? "text-stone-400" : "text-stone-500"
                            }`}
                          >
                            (Coming Soon)
                          </span>
                        </span>
                      }
                      footer={
                        <div
                          className={`text-sm transition-colors duration-300 ease-in-out ${
                            isDarkMode ? "text-stone-400" : "text-stone-500"
                          }`}
                        >
                          <p>Publish Date: {formatDate(post.date)}</p>
                          <p>
                            Last Edited: {formatLastEdited(post.lastEdited)}
                          </p>
                        </div>
                      }
                      content={
                        <>
                          {post.image && (
                            <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
                              <img
                                src={post.image}
                                alt="Blog preview"
                                className="h-full w-full object-cover transition-transform duration-300 ease-in-out"
                              />
                            </div>
                          )}
                          <p
                            className={`text-base transition-colors duration-300 ease-in-out ${
                              isDarkMode ? "text-stone-300" : "text-stone-600"
                            } line-clamp-3`}
                          >
                            {getExcerpt(post)}
                          </p>
                        </>
                      }
                      className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out border-t-4 ${
                        isDarkMode
                          ? "bg-stone-800 border-red-400/50 opacity-50"
                          : "bg-white border-red-800/50 opacity-50"
                      } cursor-not-allowed overflow-hidden`}
                    />
                  ) : (
                    <Link to={`/blog/${post.id}`} className="block">
                      <Card
                        title={
                          <span
                            className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${
                              isDarkMode ? "text-stone-200" : "text-stone-800"
                            } group-hover:underline`}
                          >
                            {post.title}
                          </span>
                        }
                        footer={
                          <div
                            className={`text-sm transition-colors duration-300 ease-in-out ${
                              isDarkMode ? "text-stone-400" : "text-stone-500"
                            }`}
                          >
                            <p>Published: {formatDate(post.date)}</p>
                            <p>
                              Last Edited: {formatLastEdited(post.lastEdited)}
                            </p>
                          </div>
                        }
                        content={
                          <>
                            {post.image && (
                              <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
                                <img
                                  src={post.image}
                                  alt="Blog preview"
                                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                              </div>
                            )}
                            <p
                              className={`text-base transition-colors duration-300 ease-in-out ${
                                isDarkMode ? "text-stone-300" : "text-stone-600"
                              } line-clamp-3`}
                            >
                              {getExcerpt(post)}
                            </p>
                          </>
                        }
                        className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out border-t-4 ${
                          isDarkMode
                            ? "bg-stone-800 border-red-400/50 hover:bg-stone-700 hover:shadow-xl"
                            : "bg-white border-red-800/50 hover:bg-stone-100 hover:shadow-xl"
                        } overflow-hidden`}
                      />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Blog;
