import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dog, Leaf } from "lucide-react";

function Navigation() {
  const location = useLocation(); // Get the current route

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Gut Health", href: "/gut-health" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Quiz", href: "/quiz" },
    { name: "Products", href: "/products" },
  ];

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Dog className="mr-2" />
          <span className="text-2xl font-bold">Aussie Gut Pack</span>
        </Link>
        <div className="space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-1 rounded ${
                location.pathname === item.href
                  ? "bg-green-800"
                  : "hover:bg-green-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
