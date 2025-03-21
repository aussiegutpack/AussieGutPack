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
            content: "Gut health is crucial for overall well-being...",
          },
          {
            id: "2",
            title: "How to Maintain a Healthy Gut",
            date: "February 3, 2025",
            content:
              "Maintaining a healthy gut involves a diet rich in fiber...",
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
      <p
        className={`text-lg mb-6 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-white" : "text-red-600"
        }`}
      >
        {post.content}
      </p>
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
