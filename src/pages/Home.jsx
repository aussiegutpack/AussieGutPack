// src/pages/Home.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../App";
import Button from "../components/ui/Button";
import Background from "../components/layout/Background";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { Helmet } from "react-helmet-async";

function Home() {
  const { isDarkMode } = useContext(ThemeContext);
  const headerRef = useRef(null);
  const roofRef = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isRoofVisible, setIsRoofVisible] = useState(false); // Changed to false for testing
  const [content, setContent] = useState({
    quotes: [],
    currentWorkout: { description: "", warmup: [], main: [] },
    scheduledWorkouts: [],
    aboutUs: "",
    dailyChallenges: [],
    lastUpdated: null,
  });
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [latestBlogPost, setLatestBlogPost] = useState(null);
  const [upcomingBlogPost, setUpcomingBlogPost] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(
    () => JSON.parse(localStorage.getItem("completedChallenges")) || []
  );

  useEffect(() => {
    const fetchAndUpdateContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "content", "home");
        console.log("Fetching content/home...");
        const docSnap = await getDoc(docRef);
        console.log("Document exists:", docSnap.exists());

        let newContent = {
          quotes: [
            "An athlete won't judge you for working out.",
            "A millionaire won't judge you for starting a business.",
            "A musician won't judge you for trying to sing a song.",
            "It's always the people going nowhere that have something to say.",
            "Idle hands do the devil's work",
          ],
          currentWorkout: {
            description:
              "A quick 20-minute routine to kickstart your metabolism and improve digestion.",
            warmup: ["5-minute brisk walk or jog", "3 sets of 15 squats"],
            main: [
              "3 sets of 10 push-ups",
              "2 sets of 20 jumping jacks",
              "1-minute plank hold",
            ],
          },
          scheduledWorkouts: [],
          aboutUs: "Here at Primal Biome, we believe life should feel less like a chore and more like an adventure. We're dedicated to empowering your digestive health naturally through tips, workouts, and challenges.",
          dailyChallenges: [
            "Drink 8 glasses of water.",
            "Take a 10-minute digestion-boosting walk with your Aussie.",
            "Try a gut-friendly snack like yogurt or pumpkin.",
            "Eat a fiber-rich meal.",
            "Practice 5 minutes of deep breathing.",
          ],
          lastUpdated: null,
        };

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Firestore data:", data);
          newContent = {
            ...newContent,
            ...data,
            quotes: Array.isArray(data.quotes)
              ? data.quotes
              : newContent.quotes,
            currentWorkout: {
              description:
                data.currentWorkout?.description ||
                newContent.currentWorkout.description,
              warmup: Array.isArray(data.currentWorkout?.warmup)
                ? data.currentWorkout.warmup
                : newContent.currentWorkout.warmup,
              main: Array.isArray(data.currentWorkout?.main)
                ? data.currentWorkout.main
                : newContent.currentWorkout.main,
            },
            scheduledWorkouts: Array.isArray(data.scheduledWorkouts)
              ? data.scheduledWorkouts
              : [],
            aboutUs: data.aboutUs || newContent.aboutUs,
            dailyChallenges: Array.isArray(data.dailyChallenges)
              ? data.dailyChallenges
              : newContent.dailyChallenges,
            lastUpdated: data.lastUpdated || newContent.lastUpdated,
          };
        } else {
          console.warn("No document found at content/home, initializing...");
          await setDoc(docRef, newContent);
        }

        const now = new Date();
        const updatedScheduledWorkouts = [...newContent.scheduledWorkouts];
        let shouldUpdate = false;

        updatedScheduledWorkouts.sort(
          (a, b) => new Date(a.updateDateTime) - new Date(b.updateDateTime)
        );

        if (updatedScheduledWorkouts.length > 0) {
          const nextWorkout = updatedScheduledWorkouts[0];
          const nextUpdateTime = new Date(nextWorkout.updateDateTime);
          if (
            now >= nextUpdateTime &&
            (!newContent.lastUpdated ||
              new Date(newContent.lastUpdated) < nextUpdateTime)
          ) {
            newContent.currentWorkout = {
              description: nextWorkout.description || "",
              warmup: nextWorkout.warmup || [],
              main: nextWorkout.main || [],
            };
            updatedScheduledWorkouts.shift();
            newContent.scheduledWorkouts = updatedScheduledWorkouts;
            newContent.lastUpdated = now.toISOString();
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          await setDoc(docRef, newContent, { merge: true });
          console.log("Updated Firestore document with new workout");
        }

        console.log("Setting content:", newContent);
        setContent(newContent);

        try {
          const blogCollectionRef = collection(db, "content", "blog", "posts");
          const blogSnapshot = await getDocs(blogCollectionRef);
          if (blogSnapshot.empty) {
            console.log("No blog posts found");
            setLatestBlogPost({
              id: "1",
              title: "The Importance of Gut Health",
              date: "2025-01-15",
              blocks: [
                {
                  type: "paragraph",
                  content: "Gut health is crucial for overall well-being...",
                },
              ],
              excerpt: "Gut health is crucial for overall well-being...",
            });
            return;
          }

          const blogPosts = blogSnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title || "Untitled Post",
            date: doc.data().date || new Date().toISOString(),
            blocks: doc.data().blocks || [],
          }));

          if (blogPosts.length > 0) {
            blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latestPost = blogPosts[0];
            const excerpt = getExcerpt(latestPost);
            setLatestBlogPost({ ...latestPost, excerpt });

            const currentDate = new Date("2025-04-16T00:00:00Z");
            const upcomingPosts = blogPosts
              .filter((post) => new Date(post.date) > currentDate)
              .sort((a, b) => new Date(a.date) - new Date(b.date));
            if (upcomingPosts.length > 0) {
              const upcomingPost = upcomingPosts[0];
              const upcomingExcerpt = getExcerpt(upcomingPost);
              setUpcomingBlogPost({ ...upcomingPost, excerpt: upcomingExcerpt });
            }
          }
        } catch (err) {
          console.error("Error fetching blog posts:", err);
          setLatestBlogPost({
            id: "1",
            title: "The Importance of Gut Health",
            date: "2025-01-15",
            blocks: [
              {
                type: "paragraph",
                content: "Gut health is crucial for overall well-being...",
              },
            ],
            excerpt: "Gut health is crucial for overall well-being...",
          });
        }
      } catch (error) {
        console.error("Error in fetchAndUpdateContent:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setIsLoading(false);
        console.log("isLoading set to false");
      }
    };

    fetchAndUpdateContent();
  }, []);

  const getExcerpt = (post) => {
    if (!post || !post.blocks || post.blocks.length === 0) return "Read more...";
    const firstTextBlock = post.blocks.find(
      (block) =>
        block.type === "paragraph" ||
        block.type === "list" ||
        block.type === "bullet"
    );
    if (!firstTextBlock) return "Read more...";
    if (firstTextBlock.type === "paragraph" && firstTextBlock.content) {
      return firstTextBlock.content.split(" ").slice(0, 30).join(" ") + "...";
    } else if (
      Array.isArray(firstTextBlock.content) &&
      firstTextBlock.content.length > 0
    ) {
      return (
        firstTextBlock.content[0] +
        (firstTextBlock.content.length > 1 ? "..." : "")
      );
    }
    return "Read more...";
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          console.log(
            `IntersectionObserver: ${entry.target === headerRef.current ? "headerRef" : "roofRef"} isIntersecting: ${isVisible}`
          );
          if (entry.target === headerRef.current) setIsHeaderVisible(isVisible);
          if (entry.target === roofRef.current) setIsRoofVisible(isVisible);
        });
      },
      { threshold: 0.1 } // Lowered threshold to 0.1
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (roofRef.current) observer.observe(roofRef.current);

    // Fallback: Force visibility after 2 seconds if observer doesn't trigger
    const timeout = setTimeout(() => {
      if (!isRoofVisible) {
        console.log(
          "IntersectionObserver timeout: Forcing isRoofVisible to true"
        );
        setIsRoofVisible(true);
      }
      if (!isHeaderVisible) {
        console.log(
          "IntersectionObserver timeout: Forcing isHeaderVisible to true"
        );
        setIsHeaderVisible(true);
      }
    }, 2000);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (roofRef.current) observer.unobserve(roofRef.current);
      clearTimeout(timeout);
    };
  }, [isHeaderVisible, isRoofVisible]); // Added dependencies to re-run if states change

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(
        (prevIndex) => (prevIndex + 1) % (content.quotes.length || 1)
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [content.quotes.length]);

  useEffect(() => {
    localStorage.setItem(
      "completedChallenges",
      JSON.stringify(completedChallenges)
    );
  }, [completedChallenges]);

  const quoteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } },
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  };

  const toggleChallenge = (index) => {
    setCompletedChallenges((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allChallengesCompleted =
    content.dailyChallenges.length > 0 &&
    completedChallenges.length === content.dailyChallenges.length &&
    content.dailyChallenges.every((_, index) =>
      completedChallenges.includes(index)
    );

  const baseUrl = "https://aussiegutpack.github.io/AussieGutPack";
  const currentUrl = `${baseUrl}${ location.pathname === "/" ? "" : location.pathname }`;

  return (
    <>
      <Helmet>
        <title>Primal Biome - Empowering Digestive Health Naturally</title>
        <meta
          name="description"
          content="Join Primal Biome to improve your gut health and overall wellness with natural tips, workouts, and challenges inspired by Australian Shepherds."
        />
        <meta
          name="keywords"
          content="gut health, digestive health, Australian Shepherd, wellness, fitness, daily challenges, Primal Biome"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Primal Biome - Empowering Digestive Health Naturally"
        />
        <meta
          property="og:description"
          content="Join Primal Biome to improve your gut health and overall wellness with natural tips, workouts, and challenges inspired by Australian Shepherds."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={`${baseUrl}/images/og-image.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Primal Biome - Empowering Digestive Health Naturally"
        />
        <meta
          name="twitter:description"
          content="Join Primal Biome to improve your gut health and overall wellness with natural tips, workouts, and challenges inspired by Australian Shepherds."
        />
        <meta name="twitter:image" content={`${baseUrl}/images/og-image.jpg`} />
        {latestBlogPost && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: latestBlogPost.title,
              datePublished: latestBlogPost.date,
              description: latestBlogPost.excerpt,
              author: {
                "@type": "Organization",
                name: "Primal Biome",
              },
              publisher: {
                "@type": "Organization",
                name: "Primal Biome",
                logo: {
                  "@type": "ImageObject",
                  url: `${baseUrl}/images/creatine.png`,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${baseUrl}/blog/${latestBlogPost.id}`,
              },
            })}
          </script>
        )}
      </Helmet>
      <main
        id="main-content"
        className={`min-h-screen flex flex-col ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
        style={{ minHeight: "100vh" }} // Ensure main takes up full viewport height
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <p
              className={`text-xl ${isDarkMode ? "text-white" : "text-red-600"}`}
            >
              Loading content...
            </p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">{error}</div>
        ) : (
          <>
            {console.log("Rendering sections, content:", content)}
            <section
              ref={headerRef}
              className={`py-2 px-6 ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
              style={{ minHeight: "150px" }} // Further reduced minHeight
            >
              <div className="container mx-auto text-center">
                <header>
                  <h1
                    className={`text-4xl font-bold mb-8 transition-colors duration-300 ease-in-out ${isDarkMode ? "text-red-400" : "text-red-800"}`}
                  >
                    Welcome to Primal Biome
                  </h1>
                  <p
                    className={`text-2xl max-w-2xl mx-auto mb-8 transition-colors duration-300 ease-in-out ${isDarkMode ? "text-white" : "text-red-600"}`}
                  >
                    Empowering Digestive Health Naturally
                  </p>
                </header>
              </div>
            </section>

            {/* About Us Section */}
            <section className={`pt-4 pb-8 px-6 w-full ${isDarkMode ? "bg-stone-800 rounded-lg shadow-lg" : "bg-gray-100 rounded-lg shadow-lg"}`}>
              <div className="container mx-auto text-left p-6">
                <h3 className={`text-3xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${isDarkMode ? "text-red-400" : "text-red-800"}`}>About Us</h3>
                <p className={`text-lg ${isDarkMode ? "text-white" : "text-stone-700"}`}>{content.aboutUs}</p>
              </div>
            </section>

            {/* Container for side-by-side sections: Workout and Daily Challenges */}
            <div className="flex flex-wrap -mx-3 mt-8">

              {/* Workout Section */}
              <section className={`workout-section py-8 pl-6 pr-6 w-3 md:w-1/2 ${isDarkMode ? "bg-stone-800 rounded-lg shadow-lg" : "bg-gray-100 rounded-lg shadow-lg"}`} aria-labelledby="workout-heading">
                <div className="container mx-auto text-left p-6">
                  <h3
                    id="workout-heading"
                    className={`text-4xl font-bold mb-8 transition-colors duration-300 ease-in-out ${isDarkMode ? "text-red-400" : "text-red-800"}`}
                  >
                    Workout of the Day
                  </h3>
                  <p className={`${isDarkMode ? "text-white" : "text-stone-700"}`}>{content.currentWorkout.description}</p>
                  <h4 className={`mt-4 mb-2 ${isDarkMode ? "text-red-400" : "text-red-800"}`}>Warm Up</h4>
                  <ul className={`list-disc list-inside ${isDarkMode ? "text-white" : "text-stone-700"}`}>
                    {content.currentWorkout.warmup.map((exercise, index) => <li key={index}>{exercise}</li>)}
                  </ul>
                  <h4 className={`mt-4 mb-2 ${isDarkMode ? "text-red-400" : "text-red-800"}`}>Main Workout</h4>
                  <ul className={`list-disc list-inside ${isDarkMode ? "text-white" : "text-stone-700"}`}>
                    {content.currentWorkout.main.map((exercise, index) => <li key={index}>{exercise}</li>)}
                  </ul>
                </div>
              </section>

              {/* Daily Challenges Section */}
              <section className={`py-8 px-3 w-full md:w-1/2 ${isDarkMode ? "bg-stone-800 rounded-lg shadow-lg" : "bg-gray-100 rounded-lg shadow-lg"}`}>
                <div className="container mx-auto text-left p-6">
                  <h3 className={`text-3xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${isDarkMode ? "text-red-400" : "text-red-800"}`}>Daily Challenges</h3>
                  <ul className={`list-disc list-inside ${isDarkMode ? "text-white" : "text-stone-700"}`}>
                    {content.dailyChallenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              </section>

            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Home;
