import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import GutHealth from "./pages/GutHealth";
import Purchase from "./pages/Purchase";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Quiz from "./pages/Quiz";
import "./App.css";

export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Router basename="/aussie-gut-pack">
        <TransitionGroup>
          <CSSTransition
            key={window.location.pathname}
            classNames="fade"
            timeout={3000}
          >
            <div
              className={`transition-wrapper ${
                isDarkMode ? "dark-mode" : "light-mode"
              }`}
            >
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="gut-health" element={<GutHealth />} />
                  <Route path="purchase" element={<Purchase />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:id" element={<BlogPost />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="quiz" element={<Quiz />} />
                </Route>
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
