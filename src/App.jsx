import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import GutHealth from "./pages/GutHealth";
import Purchase from "./pages/Purchase";
import Blog from "./pages/Blog"; // List of all blog posts
import BlogPost from "./pages/BlogPost"; // Single post view
import FAQ from "./pages/FAQ";
import Quiz from "./pages/Quiz";
import "./App.css";

function App() {
  return (
    <Router>
      <TransitionGroup>
        {/* Apply the transition on the Routes container */}
        <CSSTransition
          key={window.location.pathname} // Ensure different routes have different keys
          classNames="fade"
          timeout={3000} // Duration of the fade animation
        >
          <div className="transition-wrapper">
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
  );
}

export default App;
