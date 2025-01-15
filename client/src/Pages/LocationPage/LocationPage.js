import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./LocationPage.module.scss";
import axiosInstance from "../../api/axiosInstance";
import AdventureCard from "../../Components/BlogPosts/Card/AdventureCard";

// Define sections for activities
const sections = [
  { id: "Mountain-Biking", label: "Mountain Biking", category: "mountain-biking" },
  { id: "Canyoneering", label: "Canyoneering", category: "canyoneering" },
  { id: "Backpacking", label: "Backpacking", category: "backpacking" },
  { id: "Climbing", label: "Climbing", category: "climbing" },
  { id: "Hiking", label: "Hiking", category: "hiking" },
];

const LocationPage = () => {
  const { location } = useParams(); // Get the location from the route
  const [locationData, setLocationData] = useState(null); // State to store location data
  const [filteredPosts, setFilteredPosts] = useState([]); // State to store filtered posts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [activeSection, setActiveSection] = useState(""); // Track active section
  const observer = useRef(null);

  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationResponse = await axiosInstance.get(`/locations/${location.toLowerCase()}`);
        setLocationData(locationResponse.data);

        const blogPostsResponse = await axiosInstance.get(`/blog-posts`);
        const filtered = blogPostsResponse.data.filter(
          (post) => post.metadata.location.toLowerCase() === location.toLowerCase()
        );
        setFilteredPosts(filtered);
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError("Location not found or failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [location]);

  // Group blog posts by category for sorting
  const categorizedPosts = sections.reduce((acc, section) => {
    acc[section.category] = filteredPosts.filter(
      (post) => post.metadata.category.toLowerCase() === section.category
    );
    return acc;
  }, {});

  // Observer for active section tracking
  useEffect(() => {
    const sectionElements = sections.map((section) => document.getElementById(section.id));

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sectionElements.forEach((el) => {
      if (el) observer.current.observe(el);
    });

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!locationData) {
    return <div className={styles.error}>Location not found.</div>;
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <img src={`${IMAGE_BASE_URL}${locationData.image}`} alt={location} />
        <h1>{location.toUpperCase()}</h1>
        {locationData.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <div className={styles.mainContainer}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={activeSection === section.id ? styles.activeLink : ""}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.overview}>
                <h1 >{section.label}</h1>
                <div className={styles.cardGrid}>
                  {categorizedPosts[section.category]?.length > 0 ? (
                    categorizedPosts[section.category].map((post) => (
                      <AdventureCard
                        key={post._id}
                        post={post}
                        imageBaseUrl={IMAGE_BASE_URL}
                      />
                    ))
                  ) : (
                    <p>No adventures found for this activity.</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
