// Import Libraries
import React, { useState, useEffect, useRef } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";

// Import Styles
import styles from "./CreateBlogPost.module.scss";

// Import Utilities
import axiosInstance from "../../../api/axiosInstance.js";
import {
  initializeFormData,
  handleSubmit,
} from "../../../utils/blogPostUtils.js";

// Import Context
import { useNotification } from "../../../context/NotificationContext/NotificationContext.js";
import { useBlogPostContext } from "../../../context/BlogPostContext/BlogPostContext";

const CreateBlogPost = ({ isEdit = false }) => {
  // ========================
  // 1. State Variables
  // ========================

  // Metadata State
  const [status, setStatus] = useState("draft");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("canyoneering");
  const [publishedDate, setPublishedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedLocation, setSelectedLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [locations, setLocations] = useState([]);

  // Intro Section State
  const [introTitle, setIntroTitle] = useState("");
  const [introDate, setIntroDate] = useState("");
  const mainImageInputRef = useRef(null);
  const [mainImage, setMainImage] = useState("");

  // Overview Section State
  const [overviewTexts, setOverviewTexts] = useState([""]);
  const [overviewImages, setOverviewImages] = useState([]); // For overview section
  const [routeName, setRouteName] = useState("");
  const [length, setLength] = useState("");
  const [rating, setRating] = useState("");
  const [rappels, setRappels] = useState("");

  // Gear Section State
  const [gearList, setGearList] = useState([{ item: "", description: "" }]);
  const [gearText, setGearText] = useState("");

  // Route Section State
  const [routeSections, setRouteSections] = useState([
    { title: "Approach", content: [""] },
    { title: "Canyon", content: [""] },
    { title: "Exit", content: [""] },
  ]);

  // Photos Section State
  const [galleryImages, setGalleryImages] = useState([]);
  // const [photoUrls, setPhotoUrls] = useState([""]);

  // Miscellaneous State
  const [loading, setLoading] = useState(isEdit);

  // ========================
  // 2. Constants
  // ========================
  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogPosts } = useBlogPostContext();
  const notify = useNotification();
  const blogPostToEdit = blogPosts.find((post) => post._id === id);
  const defaultSections = {
    canyoneering: ["Approach", "Canyon", "Exit"],
    climbing: ["Approach", "Route"],
    "mountain biking": ["Trail"],
    hiking: ["Route"],
    backpacking: ["Route"],
  };

  // ========================
  // 3. Effect Hooks
  // ========================

  // Initialize form for editing
  useEffect(() => {
    if (isEdit && blogPostToEdit) {
      initializeFormData(blogPostToEdit);
      setLoading(false);
    }
  }, [isEdit, blogPostToEdit]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get("/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        notify("error", "Failed to fetch locations. Please try again.");
      }
    };

    fetchLocations();
  }, []);

  // Update route sections when category changes
  useEffect(() => {
    if (!isEdit) {
      const newSections =
        defaultSections[category]?.map((title) => ({
          title,
          content: [""],
        })) || [];
      setRouteSections(newSections);
    }
  }, [category, isEdit]);

  // ========================
  // 4. Utility Functions
  // ========================
  useEffect(() => {
    if (isEdit && blogPostToEdit) {
      const setters = {
        setSlug,
        setStatus,
        setCategory,
        setPublishedDate,
        setSelectedLocation,
        setTags,
        setLatitude,
        setLongitude,
        setMainImage,
        setIntroTitle,
        setIntroDate,
        setOverviewTexts,
        setRouteName,
        setLength,
        setRating,
        setRappels,
        setOverviewImages,
        setGearList,
        setGearText,
        setRouteSections,
        setGalleryImages,
      };

      console.log("Setters object:", setters); // Debug to ensure all properties are defined

      initializeFormData(blogPostToEdit, setters);
      setLoading(false);
    }
  }, [isEdit, blogPostToEdit]);

  // ========================
  // 5. Handlers
  // ========================

  const addRouteSection = () =>
    setRouteSections([...routeSections, { title: "", content: [""] }]);

  const deleteRouteSection = (index) =>
    setRouteSections(routeSections.filter((_, i) => i !== index));

  const handleSectionTitleChange = (index, newTitle) =>
    setRouteSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, title: newTitle } : section
      )
    );

  const handleSectionContentChange = (sectionIndex, contentIndex, value) =>
    setRouteSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              content: section.content.map((c, ci) =>
                ci === contentIndex ? value : c
              ),
            }
          : section
      )
    );

  const addContentToSection = (sectionIndex) =>
    setRouteSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? { ...section, content: [...section.content, ""] }
          : section
      )
    );

  const deleteContentFromSection = (sectionIndex, contentIndex) =>
    setRouteSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              content: section.content.filter((_, ci) => ci !== contentIndex),
            }
          : section
      )
    );

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // const toggleSection = (section) => {
  //   setExpandedSection(expandedSection === section ? null : section);
  // };

  const addOverviewText = () => setOverviewTexts([...overviewTexts, ""]);
  const deleteOverviewText = (index) => {
    setOverviewTexts(overviewTexts.filter((_, i) => i !== index));
  };

  const addGearItem = () =>
    setGearList([...gearList, { item: "", description: "" }]);
  const deleteGearItem = (index) => {
    setGearList(gearList.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const deleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleChange = (setter, index, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleFileUpload = async (files, setter, isSingle = false) => {
    const formData = new FormData();

    if (files instanceof File) {
      formData.append("files", files);
    } else {
      for (const file of files) {
        formData.append("files", file);
      }
    }

    try {
      const response = await axiosInstance.post("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Set the first URL for single file uploads
      if (isSingle) {
        setter(response.data.urls[0]); // Pass the first URL
      } else {
        setter((prev) => [...prev, ...response.data.urls]); // Append to array for multiple uploads
      }
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload files. Please try again.");
    }
  };

  const onSubmit = (event) => {
    handleSubmit({
      event,
      state: {
        status,
        tags,
        publishedDate,
        category,
        selectedLocation,
        slug,
        latitude,
        longitude,
        mainImage,
        introTitle,
        introDate,
        overviewTexts,
        routeName,
        length,
        rating,
        rappels,
        overviewImages,
        gearText,
        gearList,
        routeSections,
        galleryImages,
      },
      notify,
      navigate,
      isEdit,
      id,
    });
  };

  if (loading) {
    return <p>Loading blog post...</p>;
  }
  if (
    isEdit &&
    (!blogPostToEdit || !blogPostToEdit.sections || !blogPostToEdit.sections[0])
  ) {
    console.error("Invalid blog post data:", blogPostToEdit);
    notify("error", "Invalid blog post data.");
    navigate("/admin"); // Redirect back to the admin page or a safe location
    return null;
  }

  if (isEdit && !blogPostToEdit) {
    notify("error", "Blog post not found.");
    navigate("/admin");
    return null;
  }

  return (
    <>
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>{isEdit ? "Edit Blog Post" : "Create Blog Post"}</h1>
            <Form
              className={styles.blogPostForm}
              method="post"
              onSubmit={onSubmit}
            >
              {/* Metadata Section */}
              <section className={styles.section}>
                <h2>Metadata</h2>

                {/* Post Status */}
                <label>
                  Post Status:
                  <select
                    name="postStatus"
                    className={styles.selectInput}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>

                {/* Tags with Add/Delete Functionality */}
                <label>
                  Tags:
                  <div className={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                      <div key={index} className={styles.tag}>
                        <span>{tag}</span>
                        <button
                          type="button"
                          className={`${styles.deleteButton} ${styles.button}`}
                          onClick={() => deleteTag(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className={styles.input}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          addTag();
                          e.preventDefault();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={styles.button}
                      onClick={addTag}
                    >
                      Add Tag
                    </button>
                  </div>
                </label>

                {/* Published Date */}
                <label>
                  Published Date:
                  <input
                    type="date"
                    name="publishedDate"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className={styles.input}
                  />
                </label>
                {/* Category Dropdown */}
                <label>
                  Category:
                  <select
                    name="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className={styles.selectInput}
                  >
                    {Object.keys(defaultSections).map((cat) => (
                      <option
                        key={cat}
                        value={cat.replace(/\s+/g, "-").toLowerCase()}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                {/* Location Dropdown */}
                <label>
                  Location:
                  <select
                    name="location"
                    className={styles.selectInput}
                    required
                    value={selectedLocation || ""} // Ensure a default empty value
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a location
                    </option>
                    {locations.map((location) => (
                      <option key={location._id} value={location.name}>
                        {location.name.charAt(0).toUpperCase() +
                          location.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Latitude:
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className={styles.input}
                    placeholder="Enter latitude"
                  />
                </label>
                <label>
                  Longitude:
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className={styles.input}
                    placeholder="Enter longitude"
                  />
                </label>

                {/* Slug */}
                <label>
                  Slug:
                  <input
                    type="text"
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={styles.input}
                    placeholder="e.g., best-canyoneering-routes"
                  />
                </label>
              </section>
              {/* Intro Section */}
              <section className={styles.section}>
                <h2>Intro</h2>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={introTitle}
                    onChange={(e) => setIntroTitle(e.target.value)}
                    className={styles.input}
                  />
                </label>
                <label>
                  Main Image:
                  {mainImage ? (
                    <div className={styles.dynamicField}>
                      {/* Display the uploaded main image */}
                      {mainImage && (
                        <img
                          src={`${IMAGE_BASE_URL}${mainImage}`}
                          alt="Main Intro Image"
                          className={styles.photoPreview}
                        />
                      )}
                      <button
                        type="button"
                        className={`${styles.deleteButton} ${styles.button}`}
                        onClick={() => setMainImage("")}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className={styles.fileUploadContainer}>
                      {/* File Input for Adding the Main Image */}
                      <input
                        type="file"
                        name="mainImage"
                        className={styles.input}
                        ref={mainImageInputRef}
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(
                              e.target.files[0],
                              setMainImage,
                              true
                            ); // Single file upload
                          }
                        }}
                      />

                      <button
                        type="button"
                        className={`${styles.addButton} ${styles.button}`}
                        onClick={() => mainImageInputRef.current.click()}
                      >
                        Upload Main Image
                      </button>
                    </div>
                  )}
                </label>

                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={introDate}
                    onChange={(e) => setIntroDate(e.target.value)}
                    className={styles.input}
                  />
                </label>
              </section>

              {/* Overview Section */}
              <section className={styles.section}>
                <h2>Overview</h2>
                <label>
                  Route Name:
                  <input
                    type="text"
                    name="routeName"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    className={styles.input}
                  />
                </label>
                <label>
                  Length:
                  <input
                    type="text"
                    name="length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className={styles.input}
                  />{" "}
                </label>
                <label>
                  Rating:
                  <input
                    type="text"
                    name="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className={styles.input}
                  />{" "}
                </label>
                <label>
                  Rappels:
                  <input
                    type="text"
                    name="rappels"
                    value={rappels}
                    onChange={(e) => setRappels(e.target.value)}
                    className={styles.input}
                  />{" "}
                </label>
                <h3>Portrait Images</h3>
                {overviewImages.map((url, index) => (
                  <div key={index} className={styles.dynamicField}>
                    <img
                      src={`${IMAGE_BASE_URL}${url}`}
                      alt={`Overview Image ${index + 1}`}
                      className={styles.photoPreview}
                    />
                    <button
                      type="button"
                      className={`${styles.deleteButton} ${styles.button}`}
                      onClick={() =>
                        setOverviewImages(
                          overviewImages.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <input
                  type="file"
                  name="galleryImages"
                  multiple
                  className={styles.input}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleFileUpload(e.target.files, setGalleryImages); // FileList
                    }
                  }}
                />

                <h3>Text Sections</h3>
                {overviewTexts.map((text, index) => (
                  <div key={index} className={styles.dynamicField}>
                    <textarea
                      value={text}
                      onChange={(e) =>
                        handleChange(setOverviewTexts, index, e.target.value)
                      }
                      placeholder="Add text..."
                      className={styles.textarea}
                    />
                    <button
                      type="button"
                      className={`${styles.deleteButton} ${styles.button}`}
                      onClick={() => deleteOverviewText(index)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.button}
                  onClick={addOverviewText}
                >
                  Add More Text
                </button>
              </section>

              {/* Gear Section */}
              <section className={styles.section}>
                <h2>Gear</h2>
                <textarea
                  name="gearText"
                  value={gearText}
                  onChange={(e) => setGearText(e.target.value)}
                  className={styles.textarea}
                  placeholder="Add gear description..."
                />

                <h3>Gear List</h3>
                {gearList.map((gear, index) => (
                  <div key={index} className={styles.gearItem}>
                    <div className={styles.gearFields}>
                      <label>
                        Gear Item:
                        <input
                          name={`gearItem-${index}`}
                          type="text"
                          value={gear.item}
                          onChange={(e) =>
                            handleChange(setGearList, index, {
                              ...gear,
                              item: e.target.value,
                            })
                          }
                          placeholder="Gear item name (e.g., Canyoneering Harness)"
                          className={styles.input}
                        />
                      </label>
                      <label>
                        Description:
                        <textarea
                          name={`gearDescription-${index}`}
                          value={gear.description}
                          onChange={(e) =>
                            handleChange(setGearList, index, {
                              ...gear,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description for the gear item"
                          className={styles.textarea}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className={`${styles.deleteButton} ${styles.button}`}
                      onClick={() => deleteGearItem(index)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  className={styles.button}
                  type="button"
                  onClick={addGearItem}
                >
                  Add Gear Bullet Point
                </button>
              </section>

              {/* Route Section */}
              <section className={styles.section}>
                <h2>Route</h2>
                {routeSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className={styles.routeSection}>
                    <label>
                      Section Title:
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionTitleChange(sectionIndex, e.target.value)
                        }
                        className={styles.input}
                      />
                    </label>
                    <h3>Content</h3>
                    {section.content.map((text, contentIndex) => (
                      <div key={contentIndex} className={styles.dynamicField}>
                        <textarea
                          value={text}
                          onChange={(e) =>
                            handleSectionContentChange(
                              sectionIndex,
                              contentIndex,
                              e.target.value
                            )
                          }
                          placeholder="Add content..."
                          className={styles.textarea}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            deleteContentFromSection(sectionIndex, contentIndex)
                          }
                          className={`${styles.deleteButton} ${styles.button}`}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addContentToSection(sectionIndex)}
                      className={styles.button}
                    >
                      Add Content
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRouteSection(sectionIndex)}
                      className={`${styles.deleteButton} ${styles.button}`}
                    >
                      Delete Section
                    </button>
                  </div>
                ))}
                <button
                  className={styles.button}
                  type="button"
                  onClick={addRouteSection}
                >
                  Add Section
                </button>
              </section>

              {/* Photos Section */}
              <section className={styles.section}>
                <h2>Photos</h2>
                <h3>Gallery Images</h3>
                <div>
                  {galleryImages.map((url, index) => {
                    const fileExtension = url.split(".").pop().toLowerCase();
                    const isVideo = ["mp4", "mov", "webm", "ogg"].includes(
                      fileExtension
                    );

                    return (
                      <div key={index} className={styles.dynamicField}>
                        {isVideo ? (
                          <video
                            src={`${IMAGE_BASE_URL}${url}`}
                            controls
                            className={styles.videoPreview}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={`${IMAGE_BASE_URL}${url}`}
                            alt={`Gallery Media ${index + 1}`}
                            className={styles.photoPreview}
                          />
                        )}
                        <button
                          type="button"
                          className={`${styles.deleteButton} ${styles.button}`}
                          onClick={() =>
                            setGalleryImages(
                              galleryImages.filter((_, i) => i !== index)
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}

                  <div className={styles.fileUploadContainer}>
                    {/* Single File Upload */}
                    <input
                      type="file"
                      name="galleryPhoto"
                      accept="image/*,video/*"
                      className={styles.input}
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleFileUpload(e.target.files, setGalleryImages);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={`${styles.addButton} ${styles.button}`}
                      onClick={() =>
                        document
                          .querySelector(`input[name="galleryPhoto"]`)
                          .click()
                      }
                    >
                      Add Media
                    </button>

                    {/* Folder Upload */}
                    <input
                      type="file"
                      name="galleryFolder"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      className={styles.input}
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleFileUpload(e.target.files, setGalleryImages); // Pass FileList
                        }
                      }}
                    />

                    <button
                      type="button"
                      className={`${styles.addButton} ${styles.button}`}
                      onClick={() =>
                        document
                          .querySelector(`input[name="galleryFolder"]`)
                          .click()
                      }
                    >
                      Upload Folder
                    </button>
                  </div>
                </div>
              </section>

              <button type="submit">
                {isEdit ? "Save Changes" : "Create Blog Post"}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBlogPost;
