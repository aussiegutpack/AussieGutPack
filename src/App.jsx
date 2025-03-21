// src/App.jsx
import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Products from "./pages/shop/Products";
import GutHealth from "./pages/content/GutHealth";
import GutHealthDetail from "./pages/content/GutHealthDetail"; // New import
import Purchase from "./pages/shop/Purchase";
import Blog from "./pages/content/Blog";
import BlogPost from "./pages/content/BlogPost";
import FAQ from "./pages/content/FAQ";
import Quiz from "./pages/content/Quiz";
import Contact from "./pages/content/Contact";
import "./styles/global.css";

export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Router basename="/aussie-gut-pack">
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
                <Route path="gut-health" element={<GutHealth />} />
                <Route
                  path="gut-health/:id"
                  element={<GutHealthDetail />}
                />{" "}
                {/* New route */}
                <Route path="purchase" element={<Purchase />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogPost />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="contact" element={<Contact />} />
              </Route>
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
