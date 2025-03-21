import React, { useState, useContext } from "react";
import { ThemeContext } from "../../App";

function Contact() {
  const { isDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setStatus("Thank you! Your inquiry has been received.");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 ${
        isDarkMode ? "bg-stone-900" : "bg-white"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Contact Us
        </h1>
        <p
          className={`mb-8 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Have any questions or inquiries? Fill out the form below, and we'll
          get back to you as soon as possible!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
              placeholder="Your Name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                  : "bg-white border-red-300 text-red-600 focus:ring-red-500"
              }`}
              placeholder="Your inquiry or message..."
            />
          </div>
          <button
            type="submit"
            className="bg-red-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-900 transition-colors duration-300 ease-in-out w-full"
          >
            Send Message
          </button>
          {status && (
            <p
              className={`mt-4 text-center transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;
