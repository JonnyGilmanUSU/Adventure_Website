import axiosInstance from "../axiosInstance";

const deleteBlogPost = async (id) => {
  try {
    const response = await axiosInstance.delete(`/blog-posts/${id}`);
    console.log("[DEBUG] Blog post deleted successfully:", response.data);
    return response.data; // Return the success message
  } catch (error) {
    console.error(`[ERROR] Error deleting blog post with ID ${id}:`, error.response || error.message);

    // Pass a descriptive error message back
    throw error.response?.data || { message: "Failed to delete blog post" };
  }
};

export default deleteBlogPost;
