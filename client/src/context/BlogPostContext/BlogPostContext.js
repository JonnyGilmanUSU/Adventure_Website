import React, { createContext, useContext, useEffect, useState } from "react";
import getAllBlogPosts from "../../api/blog/getAllBlogPosts";
// Create the BlogPostContext
const BlogPostContext = createContext();

// Create a custom hook to consume the context
export const useBlogPostContext = () => useContext(BlogPostContext);

// Provider component
export const BlogPostProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog posts when the provider mounts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await getAllBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <BlogPostContext.Provider value={{ blogPosts, loading, error }}>
      {children}
    </BlogPostContext.Provider>
  );
};
