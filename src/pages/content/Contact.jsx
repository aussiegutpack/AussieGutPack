// src/pages/content/Contact.jsx
import React, { useState } from "react";
import { ThemeContext } from "../../App"; // Fixed path

function Contact() {
  const { isDarkMode } = React.useContext(ThemeContext);

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
    // For now, log the form data to the console (replace with email service later)
    console.log("Form submitted:", formData);
    setStatus("Thank you! Your inquiry has been received.");
    // Reset form
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setStatus(""), 3000); // Clear status after 3 seconds
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 ${
        isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? "text-purple-300" : "text-purple-900"
          }`}
        >
          Contact Us
        </h1>
        <p className="mb-8">
          Have any questions or inquiries? Fill out the form below, and we'll
          get back to you as soon as possible!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
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
                  ? "bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
              }`}
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
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
                  ? "bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
              }`}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
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
                  ? "bg-gray-800 border-gray-700 text-gray-300 focus:ring-purple-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
              }`}
              placeholder="Your inquiry or message..."
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors duration-300 ${
              isDarkMode
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Send Message
          </button>
          {status && <p className="mt-4 text-center">{status}</p>}
        </form>
      </div>
    </div>
  );
}

export default Contact;
