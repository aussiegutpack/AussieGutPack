// src/pages/BlogAdminPage.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function BlogAdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollectionRef = collection(db, "content", "blog", "posts");
        const blogSnapshot = await getDocs(blogCollectionRef);
        const blogData = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "",
          date: doc.data().date || "",
          blocks: doc.data().blocks || [{ type: "paragraph", content: "" }],
        }));
        setBlogPosts(
          blogData.length
            ? blogData
            : [
                {
                  id: "",
                  title: "",
                  date: "",
                  blocks: [{ type: "paragraph", content: "" }],
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
          post.date.trim() &&
          post.blocks.some((block) =>
            block.type === "paragraph"
              ? block.content.trim()
              : block.content.some((item) => item.trim())
          )
        ) {
          const postId = post.id || Date.now().toString();
          await setDoc(doc(blogCollectionRef, postId), {
            id: postId,
            title: post.title,
            date: post.date,
            blocks: post.blocks.map((block) => ({
              type: block.type,
              content:
                block.type === "list"
                  ? block.content.filter((item) => item.trim() !== "")
                  : block.content,
            })),
          });
        }
      }
      alert("Blog posts saved successfully!");
      navigate("/admin");
    } catch (err) {
      setError("Error saving blog posts: " + err.message);
    }
  };

  const addBlogPost = () =>
    setBlogPosts([
      ...blogPosts,
      {
        id: "",
        title: "",
        date: "",
        blocks: [{ type: "paragraph", content: "" }],
      },
    ]);
  const removeBlogPost = (index) =>
    setBlogPosts(blogPosts.filter((_, i) => i !== index));
  const updateBlogPost = (index, field, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[index] = { ...newBlogPosts[index], [field]: value };
    setBlogPosts(newBlogPosts);
  };

  const addBlock = (postIndex, type) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks.push({
      type,
      content: type === "paragraph" ? "" : [""],
    });
    setBlogPosts(newBlogPosts);
  };
  const removeBlock = (postIndex, blockIndex) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks = newBlogPosts[postIndex].blocks.filter(
      (_, i) => i !== blockIndex
    );
    setBlogPosts(newBlogPosts);
  };
  const updateBlockType = (postIndex, blockIndex, type) => {
    const newBlogPosts = [...blogPosts];
    const block = newBlogPosts[postIndex].blocks[blockIndex];
    newBlogPosts[postIndex].blocks[blockIndex] = {
      type,
      content: type === "paragraph" ? "" : [""], // Reset content on type change
    };
    setBlogPosts(newBlogPosts);
  };
  const updateBlockContent = (postIndex, blockIndex, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content = value;
    setBlogPosts(newBlogPosts);
  };
  const addListItem = (postIndex, blockIndex) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content.push("");
    setBlogPosts(newBlogPosts);
  };
  const removeListItem = (postIndex, blockIndex, itemIndex) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content = newBlogPosts[
      postIndex
    ].blocks[blockIndex].content.filter((_, i) => i !== itemIndex);
    setBlogPosts(newBlogPosts);
  };
  const updateListItem = (postIndex, blockIndex, itemIndex, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[postIndex].blocks[blockIndex].content[itemIndex] = value;
    setBlogPosts(newBlogPosts);
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

      <div className="mb-6">
        {blogPosts.map((post, postIndex) => (
          <div
            key={postIndex}
            className={`mb-4 border p-4 rounded ${
              isDarkMode ? "border-stone-600" : "border-red-300"
            }`}
          >
            <input
              type="text"
              value={post.title}
              onChange={(e) =>
                updateBlogPost(postIndex, "title", e.target.value)
              }
              className={`border p-2 w-full mb-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Blog Title"
            />
            <input
              type="text"
              value={post.date}
              onChange={(e) =>
                updateBlogPost(postIndex, "date", e.target.value)
              }
              className={`border p-2 w-full mb-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Date (e.g., January 15, 2025)"
            />
            <div className="mb-2">
              <h4
                className={`text-lg transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              >
                Content Blocks
              </h4>
              {post.blocks.map((block, blockIndex) => (
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
                        updateBlockType(postIndex, blockIndex, e.target.value)
                      }
                      className={`border p-2 ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white"
                          : "bg-white border-red-300 text-red-600"
                      }`}
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="list">Numbered List</option>
                    </select>
                    <button
                      onClick={() => removeBlock(postIndex, blockIndex)}
                      className="ml-2 bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                      disabled={post.blocks.length === 1}
                    >
                      Remove Block
                    </button>
                  </div>
                  {block.type === "paragraph" ? (
                    <textarea
                      value={block.content}
                      onChange={(e) =>
                        updateBlockContent(
                          postIndex,
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
                  ) : (
                    <div>
                      {block.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateListItem(
                                postIndex,
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
                              removeListItem(postIndex, blockIndex, itemIndex)
                            }
                            className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                            disabled={block.content.length === 1}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addListItem(postIndex, blockIndex)}
                        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
                      >
                        Add List Item
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => addBlock(postIndex, "paragraph")}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                >
                  Add Paragraph
                </button>
                <button
                  onClick={() => addBlock(postIndex, "list")}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                >
                  Add List
                </button>
              </div>
            </div>
            <button
              onClick={() => removeBlogPost(postIndex)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
              disabled={blogPosts.length === 1}
            >
              Remove Post
            </button>
          </div>
        ))}
        <button
          onClick={addBlogPost}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
        >
          Add Blog Post
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
        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
      >
        Back to Admin Dashboard
      </button>
    </div>
  );
}

export default BlogAdminPage;
