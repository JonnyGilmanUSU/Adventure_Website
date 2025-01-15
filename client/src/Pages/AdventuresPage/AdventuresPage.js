// Import Libraries
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Import Context
import { useBlogPostContext } from "../../context/BlogPostContext/BlogPostContext";
// Import Styles
import styles from "./AdventuresPage.module.scss";

// Import Components
import AdventureCard from "../../Components/BlogPosts/Card/AdventureCard";
import MeetInMiddleAnimation from "../../Animations/MeetInMiddleAnimation"; // Animation component

// Import Assets
import Collage from "../../Assets/adventureCollage.png";
import AdventureMap from "../../Components/Map/Map/Map";

// Define sections and their respective categories
const sections = [
  {
    id: "Mountain-Biking",
    label: "Mountain-Biking",
    category: "mountain-biking",
  },
  { id: "Canyoneering", label: "Canyoneering", category: "canyoneering" },
  { id: "Backpacking", label: "Backpacking", category: "backpacking" },
  { id: "Climbing", label: "Climbing", category: "climbing" },
  { id: "Hiking", label: "Hiking", category: "hiking" },
];

const AdventuresPage = () => {
  const { blogPosts, loading, error } = useBlogPostContext(); // Use blog post context
  const [showAnimation, setShowAnimation] = useState(true); // Show the overlay initially
  const [reverseAnimation, setReverseAnimation] = useState(false); // Trigger reverse animation
  const [isAnimationActive, setIsAnimationActive] = useState(true); // Keep animation component active
  const [activeSection, setActiveSection] = useState("");
  const observer = useRef(null);

  // Use the image base URL from environment variables
  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;

  useEffect(() => {
    // Observer for active section tracking
    const sectionElements = sections.map((section) =>
      document.getElementById(section.id)
    );

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

  // Trigger reverse animation after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setReverseAnimation(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false); // Hide overlay after animation completes
    setTimeout(() => {
      setIsAnimationActive(false); // Remove animation component
    }, 1000);
  };

  // Group blog posts by category for easier rendering
  const categorizedPosts = sections.reduce((acc, section) => {
    acc[section.category] = blogPosts.filter(
      (post) => post.metadata.category.toLowerCase() === section.category
    );
    return acc;
  }, {});

  if (loading) return <p>Loading blog posts...</p>;
  if (error) return <p>Error loading blog posts: {error}</p>;

  return (
    <div className={styles.background}>
      {/* Animation Overlay */}
      {isAnimationActive && (
        <MeetInMiddleAnimation
          triggerAnimation={reverseAnimation}
          reverse={true}
          initialState="completed"
          onAnimationComplete={handleAnimationComplete}
        />
      )}

      {/* Main Content */}
      <div className={styles.container}>
        <img src={Collage} alt="Adventures Collage" />
        <h1>Adventures</h1>
        <p>
          Welcome to the ultimate hub for outdoor exploration and adventure!
          Whether you're seeking the thrill of scaling sandstone cliffs, the
          serenity of hiking through desert trails, or the adrenaline of
          navigating narrow slot canyons, our collection of blog posts has
          something for every adventurer. Dive into stories, tips, and guides
          that showcase the best of Southern Utah's breathtaking landscapes and
          outdoor activities, from mountain biking on rugged slickrock to
          backpacking under star-filled skies.
        </p>
        <p>
          Each post is crafted to inspire your next adventure, packed with
          insights into iconic locations like Zion National Park, Bryce Canyon,
          and the Grand Staircase-Escalante. Discover hidden gems, essential
          gear tips, and firsthand experiences that will prepare you to embrace
          the beauty and challenges of the great outdoors. Whether you're a
          seasoned adventurer or just starting to explore, these blogs are your
          gateway to unforgettable journeys.
        </p>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={
                    activeSection === section.id ? styles.activeLink : ""
                  }
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.mainContent}>
          {sections.map((section) => (
            <section
              key={section.id}
              className={styles.overview}
              id={section.id}
            >
              <Link
                className={styles.link}
                to={`/adventure-categories/${section.label}`}
              >
                <h1 className={styles.sectionLabel}>{section.label}</h1>
              </Link>
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
                  <p>No adventures found for this category.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdventuresPage;
