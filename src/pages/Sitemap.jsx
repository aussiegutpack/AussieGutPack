import React, { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Sitemap = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const blogCollectionRef = collection(db, "content", "blog", "posts");
        const blogSnapshot = await getDocs(blogCollectionRef);
        const blogPosts = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date || new Date().toISOString(),
        }));

        const staticPages = [
          { url: "https://yourdomain.com/", date: new Date().toISOString() },
          {
            url: "https://yourdomain.com/about",
            date: new Date().toISOString(),
          },
          {
            url: "https://yourdomain.com/contact",
            date: new Date().toISOString(),
          },
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>https://yourdomain.com/blog/${post.id}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join("")}
</urlset>`;

        const blob = new Blob([sitemap], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sitemap.xml";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Optionally, save to server or Firebase Storage for hosting
        console.log("Sitemap generated:", sitemap);
      } catch (err) {
        console.error("Error generating sitemap:", err);
      }
    };

    generateSitemap();
  }, []);

  return <div>Generating sitemap...</div>;
};

export default Sitemap;
