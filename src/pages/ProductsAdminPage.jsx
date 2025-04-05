// src/pages/admin/ProductsAdminPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ThemeContext } from "../App";
import { db, storage, auth } from "../firebase"; // Import auth
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth methods

function ProductsAdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newProduct, setNewProduct] = useState({
    categoryId: "",
    name: "",
    price: "",
    description: "",
    image: null, // Store the file object
    color: "",
    size: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null); // Add error state for logout errors
  const navigate = useNavigate(); // Initialize useNavigate

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin"); // Redirect to /admin if not authenticated
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  // Fetch categories and products from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);

        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        setError("Error fetching data from Firestore: " + error.message);
      }
    };

    fetchData();
  }, []);

  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      const categoryRef = await addDoc(collection(db, "categories"), {
        name: newCategoryName,
      });
      setCategories([
        ...categories,
        { id: categoryRef.id, name: newCategoryName },
      ]);
      setNewCategoryName("");
    } catch (error) {
      setError("Error adding category: " + error.message);
    }
  };

  // Edit a category
  const handleEditCategory = async (category) => {
    try {
      const categoryRef = doc(db, "categories", category.id);
      await updateDoc(categoryRef, { name: category.name });
      setCategories(
        categories.map((cat) =>
          cat.id === category.id ? { ...cat, name: category.name } : cat
        )
      );
      setEditingCategory(null);
    } catch (error) {
      setError("Error updating category: " + error.message);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      const productsToDelete = products.filter(
        (prod) => prod.categoryId === categoryId
      );
      for (const prod of productsToDelete) {
        // Delete the associated image from Storage
        if (prod.image && prod.image !== "https://via.placeholder.com/80") {
          const filePath = prod.image.split("/products%2F")[1].split("?")[0];
          const storageRef = ref(
            storage,
            `products/${decodeURIComponent(filePath)}`
          );
          await deleteObject(storageRef).catch((error) => {
            setError(
              `Error deleting image for product ${prod.id}: ` + error.message
            );
          });
        }
        // Delete the product from Firestore
        await deleteDoc(doc(db, "products", prod.id));
      }
      setProducts(products.filter((prod) => prod.categoryId !== categoryId));
    } catch (error) {
      setError("Error deleting category: " + error.message);
    }
  };

  // Upload image to Firebase Storage and get URL
  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `products/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.categoryId || !newProduct.name || !newProduct.price) return;
    try {
      const imageUrl = await uploadImage(newProduct.image);

      const productRef = await addDoc(collection(db, "products"), {
        categoryId: newProduct.categoryId,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description || "No description available",
        image: imageUrl || "https://via.placeholder.com/80",
        color: newProduct.color || "N/A",
        size: newProduct.size || "N/A",
      });
      setProducts([
        ...products,
        {
          id: productRef.id,
          categoryId: newProduct.categoryId,
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.description || "No description available",
          image: imageUrl || "https://via.placeholder.com/80",
          color: newProduct.color || "N/A",
          size: newProduct.size || "N/A",
        },
      ]);
      setNewProduct({
        categoryId: "",
        name: "",
        price: "",
        description: "",
        image: null,
        color: "",
        size: "",
      });
    } catch (error) {
      setError("Error adding product: " + error.message);
      alert(
        "Failed to add product. Check Firebase Storage rules and ensure Storage is enabled."
      );
    }
  };

  // Edit a product
  const handleEditProduct = async (product) => {
    try {
      const imageUrl =
        product.image instanceof File
          ? await uploadImage(product.image)
          : product.image;

      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, {
        categoryId: product.categoryId,
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        image: imageUrl || "https://via.placeholder.com/80",
        color: product.color,
        size: product.size,
      });
      setProducts(
        products.map((prod) =>
          prod.id === product.id
            ? {
                ...prod,
                categoryId: product.categoryId,
                name: product.name,
                price: parseFloat(product.price),
                description: product.description,
                image: imageUrl || "https://via.placeholder.com/80",
                color: product.color,
                size: product.size,
              }
            : prod
        )
      );
      setEditingProduct(null);
    } catch (error) {
      setError("Error updating product: " + error.message);
      alert(
        "Failed to update product. Check Firebase Storage rules and ensure Storage is enabled."
      );
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    try {
      // Find the product to get its image URL
      const product = products.find((prod) => prod.id === productId);
      if (product.image && product.image !== "https://via.placeholder.com/80") {
        // Extract the file path from the image URL
        const filePath = product.image.split("/products%2F")[1].split("?")[0];
        const storageRef = ref(
          storage,
          `products/${decodeURIComponent(filePath)}`
        );
        await deleteObject(storageRef).catch((error) => {
          setError(
            `Error deleting image for product ${productId}: ` + error.message
          );
        });
      }

      // Delete the product from Firestore
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((prod) => prod.id !== productId));
    } catch (error) {
      setError("Error deleting product: " + error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin"); // Redirect to /admin after logout
    } catch (error) {
      setError("Failed to log out: " + error.message);
    }
  };

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
        Admin - Manage Products
      </h1>

      {error && (
        <p
          className={`text-red-500 mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </p>
      )}

      {/* Add Category Form */}
      <div className="mb-12">
        <h2
          className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Add New Category
        </h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            className={`flex-1 px-4 py-2 border rounded-md focus:outline-none ${
              isDarkMode
                ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                : "bg-white border-red-300 text-red-600 focus:ring-red-500"
            }`}
          />
          <button
            type="submit"
            className="bg-red-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-900 transition-colors duration-300 ease-in-out"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Manage Categories */}
      <div className="mb-12">
        <h2
          className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Manage Categories
        </h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-4 border rounded-md ${
                isDarkMode
                  ? "border-stone-600 bg-stone-800"
                  : "border-red-300 bg-white"
              }`}
            >
              {editingCategory?.id === category.id ? (
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className={`flex-1 px-4 py-2 border rounded-md focus:outline-none ${
                      isDarkMode
                        ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                        : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                    }`}
                  />
                  <button
                    onClick={() => handleEditCategory(editingCategory)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300 ease-in-out"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-red-600"
                    }`}
                  >
                    {category.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-red-700 transition-colors duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Form */}
      <div className="mb-12">
        <h2
          className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Add New Product
        </h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Category
            </label>
            <select
              value={newProduct.categoryId}
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
              placeholder="Product Name"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
              placeholder="Price (e.g., 29.99)"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Description
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              rows="3"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-purple-300 text-purple-600 focus:ring-purple-500"
              }`}
              placeholder="Product Description"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Color
            </label>
            <input
              type="text"
              value={newProduct.color}
              onChange={(e) =>
                setNewProduct({ ...newProduct, color: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
              placeholder="Color (optional)"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Size
            </label>
            <input
              type="text"
              value={newProduct.size}
              onChange={(e) =>
                setNewProduct({ ...newProduct, size: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
              placeholder="Size (optional)"
            />
          </div>
          <button
            type="submit"
            className="bg-red-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-900 transition-colors duration-300 ease-in-out w-full"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Manage Products */}
      <div>
        <h2
          className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Manage Products
        </h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`p-4 border rounded-md ${
                isDarkMode
                  ? "border-stone-600 bg-stone-800"
                  : "border-red-300 bg-white"
              }`}
            >
              {editingProduct?.id === product.id ? (
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Category
                    </label>
                    <select
                      value={editingProduct.categoryId}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          categoryId: e.target.value,
                        })
                      }
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                          : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                          : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                          : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                          : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          image: e.target.files[0],
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                          : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                      }`}
                    />
                    {editingProduct.image &&
                      typeof editingProduct.image === "string" && (
                        <img
                          src={editingProduct.image}
                          alt="Current product"
                          className="w-32 h-32 object-cover mt-2 rounded-md"
                        />
                      )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Color
                    </label>
                    <input
                      type="text"
                      value={editingProduct.color}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          color: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                          : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Size
                    </label>
                    <input
                      type="text"
                      value={editingProduct.size}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          size: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                          : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEditProduct(editingProduct)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300 ease-in-out w-full"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors duration-300 ease-in-out w-full"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {product.image &&
                      product.image !== "https://via.placeholder.com/80" && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                    <div>
                      <span
                        className={`text-lg font-medium ${
                          isDarkMode ? "text-white" : "text-red-600"
                        }`}
                      >
                        {product.name}
                      </span>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-stone-300" : "text-stone-600"
                        }`}
                      >
                        Category:{" "}
                        {categories.find((cat) => cat.id === product.categoryId)
                          ?.name || "Unknown"}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-stone-300" : "text-stone-600"
                        }`}
                      >
                        Price: ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-red-700 transition-colors duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/admin")}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
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
    </div>
  );
}

export default ProductsAdminPage;
