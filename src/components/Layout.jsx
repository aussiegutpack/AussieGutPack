import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-green-100 py-4 text-center">
        © 2024 Aussie Gut Pack - Your Gut Health Companion
      </footer>
    </div>
  );
}

export default Layout;
