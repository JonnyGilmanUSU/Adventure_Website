import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBlogPostContext } from '../../../context/BlogPostContext/BlogPostContext';
import deleteBlogPost from "../../../api/blog/deleteBlogPost";
import styles from "./ManageBlogPosts.module.scss";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa"; // Import icons
import AddLocationModal from "../AddLocationModal/AddLocationModal";
import { useNotification } from "../../../context/NotificationContext/NotificationContext";

const ManageBlogPosts = () => {
  const { blogPosts, loading, error, setBlogPosts } = useBlogPostContext(); // Use context
  const [showLocationModal, setShowLocationModal] = useState(false);

  const toggleLocationModal = () => setShowLocationModal(!showLocationModal);

  const navigate = useNavigate(); // React Router navigation
  
  const notify = useNotification(); // Use notification context

  const handleViewPost = (post) => {
    navigate(`/adventure-details/${post._id}`, { state: { adventure: post } }); // Navigate and pass blog post data
  };

  const handleDeletePost = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (!confirmDelete) return;
  
    try {
      const response = await deleteBlogPost(id); // Call the API to delete the blog post
      console.log("[DEBUG] Delete API response:", response); // Debug the API response
  
      // Update the blog posts state
      setBlogPosts((prev) => prev.filter((post) => post._id !== id));
  
      // Success notification
      notify("success", "Blog post deleted successfully!");
    } catch (error) {
      console.error(`[ERROR] Failed to delete blog post with ID ${id}:`, error);
  
      // Properly notify the user of the error
      if (error.response && error.response.data) {
        notify("error", error.response.data.message || "Failed to delete the blog post.");
      } else {
        notify("error", "An unexpected error occurred while deleting the blog post.");
      }
    }
  };
  

  if (loading) {
    return <p>Loading...</p>; // Show a loading state
  }

  if (error) {
    return <p>Failed to load blog posts: {error}</p>; // Show error message
  }



  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h1>Manage Blog Posts</h1>
        <button className={styles.button}>
          <Link className={styles.link} to="/admin/blog-posts/create">
            Create New Blog Post +
          </Link>
        </button>
        <button className={styles.button} onClick={toggleLocationModal}>
          Add New Location +
        </button>
        <AddLocationModal
          show={showLocationModal}
          onClose={toggleLocationModal}
        />
        <h2>All Blog Posts</h2>
        <div className={styles.blogPostHeaders}>
          <div className={styles.blogInfo}>
            <h3>Title</h3>
            <h3>Category</h3>
            <h3>Location</h3>
            <h3>Published</h3>
          </div>
          <div className={styles.blogActions}>
            <h3>Actions</h3>
          </div>
        </div>
        {blogPosts.map((post) => (
          <div key={post._id} className={styles.blogPostContainer}>
            <div className={styles.col1}>
              <p>{post.sections[0]?.intro?.title || "No Title"}</p>
              <p>{post.metadata.category || "No Category"}</p>
              <p>{post.metadata.location || "No Location"}</p>
              <p>
                {post.metadata.publishedDate
                  ? new Date(post.metadata.publishedDate).toLocaleDateString()
                  : "No Date"}
              </p>
            </div>
            <div className={styles.col2}>
              <FaEdit
                className={styles.icon}
                title="Edit"
                onClick={() => navigate(`/admin/blog-posts/edit/${post._id}`)} // Navigate to edit page
              />
              <FaEye
                className={styles.icon}
                title="View"
                onClick={() => handleViewPost(post)} // Pass the blog post data to the blogPost page
              />
              <FaTrash
                className={styles.icon}
                title="Delete"
                onClick={() => handleDeletePost(post._id)} // Call delete functionality
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBlogPosts;
