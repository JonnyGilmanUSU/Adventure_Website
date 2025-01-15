// File: src/api/blog/getBlogPostById.js
import axiosInstance from '../axiosInstance';


const getBlogPostById = async (id) => {
  try {
    const response = await axiosInstance.get(`/blog-posts/${id}`);
    return response.data; // Return the blog post data
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error.message);
    throw error; // Re-throw the error for further handling
  }
};

export default getBlogPostById;
