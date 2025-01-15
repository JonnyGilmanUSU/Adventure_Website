import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./BlogPost.module.scss";

const sections = [
  { id: "intro", label: "Intro" },
  { id: "overview", label: "Overview" },
  { id: "gear", label: "Gear" },
  { id: "route", label: "Route" },
  { id: "gallery", label: "Gallery" },
];

const AdventureDetails = () => {
  const location = useLocation();
  const { adventure } = location.state || {}; // Get adventure data from the state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL; // Use the image base URL from .env

  const openModal = (index) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setActiveImageIndex(
      (prevIndex) =>
        (prevIndex + 1) % adventure.sections[0]?.photos?.gallery.length
    );
  };

  const showPreviousImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0
        ? adventure.sections[0]?.photos?.gallery.length - 1
        : prevIndex - 1
    );
  };

  const observer = useRef(null);

  useEffect(() => {
    const handleScrollToHash = () => {
      const { hash } = window.location;
      if (hash) {
        const element = document.getElementById(hash.substring(1)); // Get the element by ID
        if (element) {
          const offset = 80; // Adjust for any sticky header height
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth", // Enable smooth scrolling
          });
        }
      }
    };

    // Handle initial load with a hash
    handleScrollToHash();

    // Listen for hash changes
    window.addEventListener("hashchange", handleScrollToHash);

    return () => {
      window.removeEventListener("hashchange", handleScrollToHash);
    };
  }, []);

  useEffect(() => {
    const sectionElements = sections.map((section) =>
      document.getElementById(section.id)
    );

    const options = {
      root: null, // The viewport is the root
      rootMargin: "0px", // No margin
      threshold: 0.5, // Section is active when 50% is visible
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
      if (observer.current) observer.current.disconnect(); // Cleanup observer on unmount
    };
  }, []);

  if (!adventure) {
    return <p>No adventure details available.</p>;
  }

  // Access sections directly
  const intro = adventure.sections[0]?.intro;
  const overview = adventure.sections[0]?.overview;
  const route = adventure.sections[0]?.route;
  const gear = adventure.sections[0]?.gear;
  const gallery = adventure.sections[0]?.photos?.gallery;

  return (
    <div className={styles.background}>
      <div className={styles.container}>
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
          {/* Intro Section */}
          <section className={styles.intro} id="intro">
            <h1>{intro?.title || "No Title"}</h1>
            <img
              src={`${IMAGE_BASE_URL}${intro?.imageUrl || ""}`}
              alt={adventure.metadata.slug || "Adventure Image"}
            />
          </section>

          {/* Overview Section */}
          <section className={styles.overview} id="overview">
            <h1>Overview</h1>
            <ul>
              <li>
                <strong>Route Name:</strong> {overview?.routeName || "N/A"}
              </li>
              <li>
                <strong>Location:</strong>{" "}
                {adventure.metadata.location || "N/A"}
              </li>
              <li>
                <strong>Length:</strong> {overview?.length || "N/A"}
              </li>
              <li>
                <strong>Rating:</strong> {overview?.rating || "N/A"}
              </li>
              <li>
                <strong>Rappels:</strong> {overview?.rappels || "N/A"}
              </li>
            </ul>
            <p>
              {overview?.content?.map((content, index) => (
                <span key={index}>{content.content}</span>
              ))}
            </p>
            <div className={styles.overviewImages}>
              {overview?.images?.map((image, index) => (
                <img
                  key={index}
                  src={`${IMAGE_BASE_URL}${image.url || ""}`} // Use the base URL with the image path
                  alt={adventure.metadata.slug || `Overview Image ${index + 1}`} // Provide an alt attribute
                  className={styles.overviewImage}
                />
              ))}
            </div>
          </section>

          {/* Gear Section */}
          <section className={styles.gear} id="gear">
            <h1>Gear</h1>
            <p>
              {gear?.content?.map((item, index) => (
                <span key={index}>{item.content}</span>
              ))}
            </p>
            <ul>
              {gear?.items?.map((item, index) => (
                <li key={index}>
                  <strong>{item.item}</strong>: {item.description}
                </li>
              ))}
            </ul>
          </section>

          {/* Route Section */}
          <section className={styles.route} id="route">
            <h1>Route</h1>
            {route?.sections?.map((section, index) => (
              <div key={index}>
                <h2>{section.title}</h2>
                <p>
                  {section.content?.map((item, i) => (
                    <span key={i}>{item.content}</span>
                  ))}
                </p>
              </div>
            ))}
          </section>

          {/* Gallery Section */}
          <section id="gallery">
            <h1>Gallery</h1>
            <div className={styles.gallery}>
              {gallery?.map((item, index) => {
                // Normalize URL extension to lowercase for case-insensitive comparison
                const fileUrl = `${IMAGE_BASE_URL}${item.url}`;
                const isVideo =
                  fileUrl.toLowerCase().endsWith(".mp4") ||
                  fileUrl.toLowerCase().endsWith(".webm") ||
                  fileUrl.toLowerCase().endsWith(".ogg") ||
                  fileUrl.toLowerCase().endsWith(".mov");

                return (
                  <div
                    key={index}
                    className={styles.galleryItem}
                    onClick={() => openModal(index)}
                    style={
                      !isVideo
                        ? { backgroundImage: `url(${fileUrl})` }
                        : undefined
                    }
                  >
                    {isVideo ? (
                      <video
                        src={fileUrl}
                        className={styles.galleryVideo}
                        muted
                        playsInline
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Modal for Enlarged View */}
            {isModalOpen && gallery?.[activeImageIndex] && (
              <div className={styles.modal} onClick={closeModal}>
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on modal content
                >
                  {gallery[activeImageIndex]?.url
                    .toLowerCase()
                    .endsWith(".mp4") ||
                  gallery[activeImageIndex]?.url
                    .toLowerCase()
                    .endsWith(".webm") ||
                  gallery[activeImageIndex]?.url
                    .toLowerCase()
                    .endsWith(".ogg") ||
                  gallery[activeImageIndex]?.url
                    .toLowerCase()
                    .endsWith(".mov") ? (
                    <video
                      src={`${IMAGE_BASE_URL}${gallery[activeImageIndex]?.url}`}
                      controls
                      autoPlay
                      className={styles.modalVideo}
                    />
                  ) : (
                    <img
                      src={`${IMAGE_BASE_URL}${gallery[activeImageIndex]?.url}`}
                      alt="Enlarged view"
                      className={styles.modalImage}
                    />
                  )}
                  <button
                    className={styles.prevButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      showPreviousImage();
                    }}
                  >
                    &#8249; {/* Left arrow */}
                  </button>
                  <button
                    className={styles.nextButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      showNextImage();
                    }}
                  >
                    &#8250; {/* Right arrow */}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdventureDetails;
