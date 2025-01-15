import React from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useBlogPostContext } from "../../../context/BlogPostContext/BlogPostContext";
import L from "leaflet";
import styles from "./Map.module.scss";

import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL; // Base URL for images

// Custom marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const Map = () => {
  const { blogPosts, loading, error } = useBlogPostContext();
  const navigate = useNavigate();

  if (loading) return <p className={styles.loading}>Loading map...</p>;
  if (error) return <p className={styles.error}>Error loading map: {error}</p>;

  return (
    <MapContainer
      center={[37.5, -113]} // Default center for the map
      zoom={7}
      className={styles.mapContainer}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {blogPosts.map((post) => {
        const { coordinates, slug, location, category } = post.metadata;
        const { intro } = post.sections[0] || {};

        // Ensure coordinates exist and are valid
        if (!coordinates || typeof coordinates.lat !== "number" || typeof coordinates.lng !== "number") {
          console.warn(`Invalid or missing coordinates for post: ${post._id}`);
          return null;
        }

        const handleMarkerClick = () => {
          navigate(`/adventure-details/${post._id}`, { state: { adventure: post } });
        };

        return (
          <Marker
            key={post._id}
            position={[coordinates.lat, coordinates.lng]} // Use lat and lng directly
            icon={defaultIcon}
            eventHandlers={{
              click: handleMarkerClick, // Navigate on marker click
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              permanent={false}
              className={styles.leafletTooltip}
            >
              <div className={styles.tooltipContent}>
                {intro?.imageUrl && (
                  <img
                    src={`${IMAGE_BASE_URL}${intro.imageUrl || ""}`} // Use base URL from .env
                    alt={slug || "Adventure Image"}
                    className={styles.tooltipImage}
                  />
                )}
                <h3 className={styles.tooltipTitle}>{intro?.title}</h3>
                <p className={styles.tooltipText}>{location}</p>
                <p className={styles.tooltipText}>{category}</p>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
