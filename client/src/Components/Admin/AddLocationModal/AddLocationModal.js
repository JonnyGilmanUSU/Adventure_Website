import React, { useState } from "react";
import styles from "./AddLocationModal.module.scss";
import { createLocation } from "../../../api/location/location";
import axiosInstance from "../../../api/axiosInstance";
const AddLocationModal = ({ show, onClose }) => {
  const [locationName, setLocationName] = useState("");
  const [image, setImage] = useState(null);
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");
  const [uploadedImage, setUploadedImage] = useState(""); // URL for the uploaded image

  // Handle file upload logic
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedImage(response.data.url); // Set the uploaded image URL
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!locationName || !uploadedImage || !paragraph1 || !paragraph2) {
      alert("Please fill out all fields.");
      return;
    }

    // Create a new location object
    const newLocation = {
      locationName: locationName.toLowerCase(),
      image: uploadedImage,
      paragraphs: [paragraph1, paragraph2],
    };

    try {
      // Use the API function to create the location
      await createLocation(newLocation);
      alert("Location added successfully!");
      onClose(); // Close modal
    } catch (error) {
      console.error("Failed to add location:", error);
      alert("Failed to add location. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h2>Add New Location</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Location Name:
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
          </label>
          <label>
            Image:
            {uploadedImage ? (
              <div className={styles.dynamicField}>
                <img
                  src={uploadedImage}
                  alt="Location"
                  className={styles.photoPreview}
                />
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => setUploadedImage("")}
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className={styles.fileUploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                >
                  Upload Image
                </button>
              </div>
            )}
          </label>
          <label>
            Paragraph 1:
            <textarea
              value={paragraph1}
              onChange={(e) => setParagraph1(e.target.value)}
              required
            />
          </label>
          <label>
            Paragraph 2:
            <textarea
              value={paragraph2}
              onChange={(e) => setParagraph2(e.target.value)}
              required
            />
          </label>
          <button type="submit">Add Location</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;
