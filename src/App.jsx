// src/App.jsx
import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Products from "./pages/shop/Products";
import ProductDetail from "./pages/shop/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/shop/Checkout";
import GutHealth from "./pages/content/GutHealth";
import GutHealthDetail from "./pages/content/GutHealthDetail";
import Purchase from "./pages/shop/Purchase";
import Blog from "./pages/content/Blog";
import BlogPost from "./pages/content/BlogPost";
import FAQ from "./pages/content/FAQ";
import Contact from "./pages/content/Contact";
import AdminPage from "./pages/AdminPage";
import HomeAdminPage from "./pages/HomeAdminPage";
import BlogAdminPage from "./pages/BlogAdminPage";
import ProductsAdminPage from "./pages/ProductsAdminPage";
import FitnessTracker from "./pages/FitnessTracker";
import PlanView from "./pages/PlanView";
import CreateCustomPlan from "./pages/CreateCustomPlan";
import LogFitness from "./pages/LogFitness";
import FitnessHistory from "./pages/FitnessHistory";
import Nutrition from "./pages/Nutrition";
import NutritionPlanView from "./pages/NutritionPlanView";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Sitemap from "./pages/Sitemap";
import "./styles/global.css";

export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const basename = import.meta.env.VITE_BASE_PATH || "/";
  console.log("Basename:", basename);

  return (
    <HelmetProvider>
      <CartProvider>
        <AuthProvider>
          <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <Router basename={basename}>
              <TransitionGroup>
                <CSSTransition
                  key={window.location.pathname}
                  classNames="fade"
                  timeout={300}
                >
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="products" element={<Products />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="gut-health" element={<GutHealth />} />
                      <Route
                        path="gut-health/:id"
                        element={<GutHealthDetail />}
                      />
                      <Route path="purchase" element={<Purchase />} />
                      <Route path="blog" element={<Blog />} />
                      <Route path="blog/:id" element={<BlogPost />} />
                      <Route path="/sitemap.xml" element={<Sitemap />} />
                      <Route path="faq" element={<FAQ />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="admin" element={<AdminPage />} />
                      <Route path="admin/home" element={<HomeAdminPage />} />
                      <Route path="admin/blog" element={<BlogAdminPage />} />
                      <Route
                        path="admin/products"
                        element={<ProductsAdminPage />}
                      />
                      <Route
                        path="/shop/product/:id"
                        element={<ProductDetail />}
                      />
                      <Route
                        path="fitness-tracker"
                        element={<FitnessTracker />}
                      />
                      <Route
                        path="fitness-tracker/plan/:id"
                        element={<PlanView />}
                      />
                      <Route
                        path="fitness-tracker/create-custom-plan"
                        element={<CreateCustomPlan />}
                      />
                      <Route
                        path="fitness-tracker/log"
                        element={<LogFitness />}
                      />
                      <Route
                        path="fitness-tracker/history"
                        element={<FitnessHistory />}
                      />
                      <Route path="nutrition" element={<Nutrition />} />
                      <Route
                        path="nutrition-plan/:id"
                        element={<NutritionPlanView />}
                      />
                      <Route path="login" element={<Login />} />
                      <Route path="signup" element={<Signup />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="profile" element={<Profile />} />
                      </Route>
                      <Route
                        path="*"
                        element={<div>404 - Page Not Found</div>}
                      />
                    </Route>
                  </Routes>
                </CSSTransition>
              </TransitionGroup>
            </Router>
          </ThemeContext.Provider>
        </AuthProvider>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
