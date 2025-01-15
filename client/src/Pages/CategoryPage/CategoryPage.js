// Import Libraries
import React from "react";
import { useParams } from "react-router-dom";

// Import Components
import AdventureCard from "../../Components/BlogPosts/Card/AdventureCard";

// Import Context
import { useBlogPostContext } from "../../context/BlogPostContext/BlogPostContext";
// Import Styles
import styles from "./CategoryPage.module.scss";

// Import Data
import categoryData from "./data/categoryData";

const CategoryPage = () => {
  const { category } = useParams(); // Get the category from the route
  const { blogPosts, loading, error } = useBlogPostContext(); // Use blog post context

  const normalizedCategory = category?.toLowerCase();
  console.log("Filtering posts for category:", normalizedCategory);

  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL; // Use base URL from .env

  const { image, text } = categoryData[normalizedCategory] || {
    image: categoryData.climbing.image, // Default image
    text: [
      "Explore the wonders of Southern Utah, where adventure awaits around every corner. Discover trails, cliffs, and landscapes that make this region unforgettable.",
      "Whether you're hiking, climbing, biking, or simply soaking in the views, Southern Utah promises an experience you'll treasure forever. Come and create your own adventure story in this remarkable landscape.",
    ],
  };

  // Filter blog posts by category
  const filteredBlogPosts = blogPosts.filter(
    (post) => post.metadata.category.toLowerCase() === normalizedCategory
  );

  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div className={styles.error}>{error}</div>; // Show error message
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <img src={image} alt={category} />
        <h1>{category?.toUpperCase()}</h1>
        {text.map((paragraph, index) => (
          <p key={index}>{paragraph}</p> // Render category-specific text
        ))}
        <div className={styles.cardGrid}>
          {filteredBlogPosts.length > 0 ? (
            filteredBlogPosts.map((post) => (
              <AdventureCard
                key={post._id}
                post={post}
                imageBaseUrl={IMAGE_BASE_URL} // Pass the base URL
              />
            ))
          ) : (
            <p>No blog posts found for this category.</p> // Show message if no posts
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
