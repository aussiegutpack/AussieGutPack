// src/pages/BlogAdminPage.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { db, auth } from "../firebase"; // Import auth
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth methods

function BlogAdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin"); // Redirect to /admin if not authenticated
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollectionRef = collection(db, "content", "blog", "posts");
        const blogSnapshot = await getDocs(blogCollectionRef);
        const blogData = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "",
          blocks: doc.data().blocks || [{ type: "paragraph", content: "" }],
          lastEdited: doc.data().lastEdited || "",
        }));

        // Sort blog posts by lastEdited (newest first)
        const sortedBlogData = blogData.sort((a, b) => {
          const lastEditedA = a.lastEdited
            ? new Date(a.lastEdited)
            : new Date(0);
          const lastEditedB = b.lastEdited
            ? new Date(b.lastEdited)
            : new Date(0);
          return lastEditedB - lastEditedA; // Newest lastEdited first
        });

        setBlogPosts(
          sortedBlogData.length
            ? sortedBlogData
            : [
                {
                  id: "",
                  title: "",
                  blocks: [{ type: "paragraph", content: "" }],
                  lastEdited: "",
                },
              ]
        );
      } catch (err) {
        setError("Failed to load blog posts: " + err.message);
      }
    };
    fetchBlogPosts();
  }, []);

  const handleSave = async () => {
    setError(null);
    try {
      const blogCollectionRef = collection(db, "content", "blog", "posts");
      const existingPosts = await getDocs(blogCollectionRef);
      for (const docSnap of existingPosts.docs) {
        await deleteDoc(docSnap.ref);
      }
      for (const post of blogPosts) {
        if (
          post.title.trim() &&
          post.blocks.some((block) =>
            block.type === "paragraph" ||
            block.type === "image" ||
            block.type === "link"
              ? block.content.trim()
              : block.content.some((item) => item.trim())
          )
        ) {
          const postId = post.id || Date.now().toString();
          await setDoc(doc(blogCollectionRef, postId), {
            id: postId,
            title: post.title,
            blocks: post.blocks.map((block) => ({
              type: block.type,
              content:
                block.type === "paragraph" || block.type === "image"
                  ? block.content
                  : block.type === "link"
                  ? { url: block.content.url, text: block.content.text }
                  : block.content.filter((item) => item.trim() !== ""),
            })),
            lastEdited: post.lastEdited || new Date().toISOString(),
          });
        }
      }
      alert("Blog posts saved successfully!");
      setSelectedPostIndex(null);
      navigate("/admin");
    } catch (err) {
      setError("Error saving blog posts: " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin"); // Redirect to /admin after logout
    } catch (err) {
      setError("Failed to log out: " + err.message);
    }
  };

  const addBlogPost = () => {
    const newBlogPosts = [
      ...blogPosts,
      {
        id: "",
        title: "",
        blocks: [{ type: "paragraph", content: "" }],
        lastEdited: new Date().toISOString(),
      },
    ];
    setBlogPosts(newBlogPosts);
    setSelectedPostIndex(newBlogPosts.length - 1);
  };

  const removeBlogPost = (index) => {
    const newBlogPosts = blogPosts.filter((_, i) => i !== index);
    setBlogPosts(newBlogPosts);
    setSelectedPostIndex(null);
  };

  const updateBlogPost = (index, field, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[index] = {
      ...newBlogPosts[index],
      [field]: value,
      lastEdited: new Date().toISOString(),
    };
    setBlogPosts(newBlogPosts);
  };

  const addBlock = (postIndex, type) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks.push({
      type,
      content:
        type === "paragraph" || type === "image"
          ? ""
          : type === "link"
          ? { url: "", text: "" }
          : [""],
    });
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  const removeBlock = (postIndex, blockIndex) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks = newBlogPosts[postIndex].blocks.filter(
      (_, i) => i !== blockIndex
    );
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  const updateBlockType = (postIndex, blockIndex, type) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex] = {
      type,
      content:
        type === "paragraph" || type === "image"
          ? ""
          : type === "link"
          ? { url: "", text: "" }
          : [""],
    };
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  const updateBlockContent = (postIndex, blockIndex, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content = value;
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  const updateLinkContent = (postIndex, blockIndex, field, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content[field] = value;
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  const addListItem = (postIndex, blockIndex) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content.push("");
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  const removeListItem = (postIndex, blockIndex, itemIndex) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content = newBlogPosts[
      postIndex
    ].blocks[blockIndex].content.filter((_, i) => i !== itemIndex);
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  const updateListItem = (postIndex, blockIndex, itemIndex, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content[itemIndex] = value;
    newBlogPosts[postIndex].lastEdited = new Date().toISOString();
    setBlogPosts(newBlogPosts);
  };

  // Format the lastEdited timestamp for display (without seconds)
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
    }); // e.g., "4/3/2025, 10:15 AM"
  };

  return (
    <div
      className={`min-h-screen p-6 ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
    >
      <h2
        className={`text-3xl transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        } mb-6`}
      >
        Manage Blog Posts
      </h2>

      {error && (
        <p
          className={`text-red-500 mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </p>
      )}

      {selectedPostIndex === null ? (
        // Blog List View
        <div className="mb-6">
          {blogPosts.length === 0 ? (
            <p
              className={`text-lg transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-stone-300" : "text-stone-600"
              }`}
            >
              No blog posts available. Add a new post to get started.
            </p>
          ) : (
            <div className="grid gap-4">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg ${
                    isDarkMode
                      ? "border-stone-600 bg-stone-800"
                      : "border-red-300 bg-white"
                  }`}
                  onClick={() => setSelectedPostIndex(index)}
                >
                  <h3
                    className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${
                      isDarkMode ? "text-white" : "text-red-600"
                    }`}
                  >
                    {post.title || "Untitled Post"}
                  </h3>
                  <p
                    className={`text-sm italic transition-colors duration-300 ease-in-out ${
                      isDarkMode ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    Last Edited: {formatLastEdited(post.lastEdited)}
                  </p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={addBlogPost}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-4"
          >
            Add Blog Post
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-4 ml-4"
          >
            Back to Admin Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-4 ml-4"
          >
            Log Out
          </button>
        </div>
      ) : (
        // Blog Edit View
        <div className="mb-6">
          <div
            className={`mb-4 border p-4 rounded ${
              isDarkMode ? "border-stone-600" : "border-red-300"
            }`}
          >
            <input
              type="text"
              value={blogPosts[selectedPostIndex].title}
              onChange={(e) =>
                updateBlogPost(selectedPostIndex, "title", e.target.value)
              }
              className={`border p-2 w-full mb-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Blog Title"
            />
            <p
              className={`text-sm italic mb-4 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              Last Edited:{" "}
              {formatLastEdited(blogPosts[selectedPostIndex].lastEdited)}
            </p>
            <div className="mb-2">
              <h4
                className={`text-lg transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              >
                Content Blocks
              </h4>
              {blogPosts[selectedPostIndex].blocks.map((block, blockIndex) => (
                <div
                  key={blockIndex}
                  className="mb-4 border-t pt-2 mt-2 border-stone-400"
                >
                  <div className="flex items-center mb-2">
                    <label
                      className={`mr-4 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Block Type:
                    </label>
                    <select
                      value={block.type}
                      onChange={(e) =>
                        updateBlockType(
                          selectedPostIndex,
                          blockIndex,
                          e.target.value
                        )
                      }
                      className={`border p-2 ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white"
                          : "bg-white border-red-300 text-red-600"
                      }`}
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="list">Numbered List</option>
                      <option value="bullet">Bullet Points</option>
                      <option value="image">Image</option>
                      <option value="link">Link</option>
                    </select>
                    <button
                      onClick={() => removeBlock(selectedPostIndex, blockIndex)}
                      className="ml-2 bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                      disabled={
                        blogPosts[selectedPostIndex].blocks.length === 1
                      }
                    >
                      Remove Block
                    </button>
                  </div>
                  {block.type === "paragraph" ? (
                    <textarea
                      value={block.content}
                      onChange={(e) =>
                        updateBlockContent(
                          selectedPostIndex,
                          blockIndex,
                          e.target.value
                        )
                      }
                      className={`border p-2 w-full h-24 ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white"
                          : "bg-white border-red-300 text-red-600"
                      }`}
                      placeholder="Paragraph Content"
                    />
                  ) : block.type === "image" ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) =>
                          updateBlockContent(
                            selectedPostIndex,
                            blockIndex,
                            e.target.value
                          )
                        }
                        className={`border p-2 w-full ${
                          isDarkMode
                            ? "bg-stone-700 border-stone-600 text-white"
                            : "bg-white border-red-300 text-red-600"
                        }`}
                        placeholder="Image URL (e.g., https://example.com/image.jpg)"
                      />
                      {block.content && (
                        <img
                          src={block.content}
                          alt="Preview"
                          className="w-full max-w-xs rounded-lg shadow-md"
                        />
                      )}
                    </div>
                  ) : block.type === "link" ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.content.url}
                        onChange={(e) =>
                          updateLinkContent(
                            selectedPostIndex,
                            blockIndex,
                            "url",
                            e.target.value
                          )
                        }
                        className={`border p-2 w-full ${
                          isDarkMode
                            ? "bg-stone-700 border-stone-600 text-white"
                            : "bg-white border-red-300 text-red-600"
                        }`}
                        placeholder="Link URL (e.g., https://example.com)"
                      />
                      <input
                        type="text"
                        value={block.content.text}
                        onChange={(e) =>
                          updateLinkContent(
                            selectedPostIndex,
                            blockIndex,
                            "text",
                            e.target.value
                          )
                        }
                        className={`border p-2 w-full ${
                          isDarkMode
                            ? "bg-stone-700 border-stone-600 text-white"
                            : "bg-white border-red-300 text-red-600"
                        }`}
                        placeholder="Link Text (e.g., Click here)"
                      />
                    </div>
                  ) : (
                    <div>
                      {block.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateListItem(
                                selectedPostIndex,
                                blockIndex,
                                itemIndex,
                                e.target.value
                              )
                            }
                            className={`border p-2 w-full mr-2 ${
                              isDarkMode
                                ? "bg-stone-700 border-stone-600 text-white"
                                : "bg-white border-red-300 text-red-600"
                            }`}
                            placeholder={`Item ${itemIndex + 1}`}
                          />
                          <button
                            onClick={() =>
                              removeListItem(
                                selectedPostIndex,
                                blockIndex,
                                itemIndex
                              )
                            }
                            className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                            disabled={
                              blogPosts[selectedPostIndex].blocks[blockIndex]
                                .content.length === 1
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          addListItem(selectedPostIndex, blockIndex)
                        }
                        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
                      >
                        Add List Item
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => addBlock(selectedPostIndex, "paragraph")}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                >
                  Add Paragraph
                </button>
                <button
                  onClick={() => addBlock(selectedPostIndex, "list")}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                >
                  Add Numbered List
                </button>
                <button
                  onClick={() => addBlock(selectedPostIndex, "bullet")}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                >
                  Add Bullet Points
                </button>
                <button
                  onClick={() => addBlock(selectedPostIndex, "image")}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                >
                  Add Image
                </button>
                <button
                  onClick={() => addBlock(selectedPostIndex, "link")}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                >
                  Add Link
                </button>
              </div>
            </div>
            <button
              onClick={() => removeBlogPost(selectedPostIndex)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2 mr-4"
              disabled={blogPosts.length === 1}
            >
              Remove Post
            </button>
            <button
              onClick={() => setSelectedPostIndex(null)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
            >
              Back to List
            </button>
          </div>
          <button
            onClick={handleSave}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mr-4"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mr-4"
          >
            Back to Admin Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogAdminPage;
