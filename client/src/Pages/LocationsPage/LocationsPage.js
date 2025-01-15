// Import Libraries
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Import Context
import { useBlogPostContext } from "../../context/BlogPostContext/BlogPostContext";

// Import Styles
import styles from "./LocationsPage.module.scss";

// Import Assets
import Collage from "../../Assets/locationsCollage.png";

// Import Component
import AdventureCard from "../../Components/BlogPosts/Card/AdventureCard";

const LocationsPage = () => {
  const { blogPosts, loading, error } = useBlogPostContext(); // Use blog post context
  const [locations, setLocations] = useState([]); // State to store unique locations
  const [activeSection, setActiveSection] = useState(""); // State to track active section
  const observer = useRef(null);

  // Use the image base URL from environment variables
  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;

  // Extract unique locations from blog posts
  useEffect(() => {
    const uniqueLocations = [
      ...new Set(blogPosts.map((post) => post.metadata.location.toLowerCase())),
    ];
    setLocations(uniqueLocations); // Store unique locations in state
  }, [blogPosts]);

  // Group blog posts by location for rendering
  const postsByLocation = locations.reduce((acc, location) => {
    acc[location] = blogPosts.filter(
      (post) => post.metadata.location.toLowerCase() === location
    );
    return acc;
  }, {});

  // Handle active section tracking
  useEffect(() => {
    const sectionElements = locations.map((location) =>
      document.getElementById(location)
    );

    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Section is active when 50% in view
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Update the active section
        }
      });
    }, options);

    sectionElements.forEach((el) => {
      if (el) observer.current.observe(el); // Observe each section
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect(); // Cleanup observer on unmount
      }
    };
  }, [locations]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div className={styles.error}>{error}</div>; // Show error message
  }

  return (
    <div className={styles.background}>
      {/* Intro Section */}
      <div className={styles.container}>
        <img src={Collage} alt="Locations Collage" />
        <h1>Locations</h1>
        <p>
          Welcome to our <strong>Locations Hub</strong>, your go-to guide for
          discovering the most stunning places to adventure. Each location
          offers unique landscapes that promise excitement and unforgettable
          memories.
        </p>
        <p>
          Explore hidden gems like the winding slot canyons of Southern Utah,
          the scenic trails of Wasatch Range, and the rugged terrain of Moab.
          Each location is chosen for its breathtaking beauty, outdoor
          opportunities, and rich natural history.
        </p>
      </div>

      {/* Main Content Section */}
      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <ul>
            {locations.map((location) => (
              <li key={location}>
                <a
                  href={`#${location}`}
                  className={
                    activeSection === location ? styles.activeLink : ""
                  }
                >
                  {location.charAt(0).toUpperCase() + location.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {locations.map((location) => (
            <section key={location} className={styles.overview} id={location}>
              <Link
                to={`/location/${location}`}
                className={styles.locationLink}
              >
                <h1 className={styles.sectionLabel}>
                  {location.charAt(0).toUpperCase() + location.slice(1)}
                </h1>
              </Link>
              <div className={styles.cardGrid}>
                {postsByLocation[location]?.length > 0 ? (
                  postsByLocation[location].map((post) => (
                    <AdventureCard
                      key={post._id}
                      post={post}
                      imageBaseUrl={IMAGE_BASE_URL}
                    />
                  ))
                ) : (
                  <p>No blog posts found for this location.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
