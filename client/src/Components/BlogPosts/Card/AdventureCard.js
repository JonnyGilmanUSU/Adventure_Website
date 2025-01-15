import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdventureCard.module.scss";

const AdventureCard = ({ post, imageBaseUrl }) => {
  return (
    <Link
      to={`/adventure-details/${post._id}`}
      state={{ adventure: post }}
      className={styles.card}
    >
      <img
        className={styles.cardImage}
        src={
          post.sections[0]?.intro?.imageUrl
            ? `${imageBaseUrl}${post.sections[0]?.intro?.imageUrl}`
            : ""
        }
        alt={post.metadata.slug || "Adventure Image"}
      />
      <p className={styles.cardTitle}>
        {post.sections[0]?.intro?.title || "No Title"}
      </p>
      <p className={styles.cardLocation}>
        {post.metadata.location || "No Location"}
      </p>
      <p className={styles.cardLevel}>
        {post.sections[0]?.overview?.rating || "No Rating"}
      </p>
    </Link>
  );
};

export default AdventureCard;
