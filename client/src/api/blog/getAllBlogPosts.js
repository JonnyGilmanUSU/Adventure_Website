import axiosInstance from '../axiosInstance';
/**
 * Fetch all blog posts from the API
 * @returns {Promise<Array>} Resolves to an array of blog posts
 */
const getAllBlogPosts = async () => {
  try {
    const response = await axiosInstance.get('/blog-posts'); // API call to fetch blog posts
    return response.data; // Return the data
  } catch (error) {
    console.error('Error fetching blog posts:', error.message); // Log error to console
    throw error; // Re-throw the error for further handling
  }
};

export default getAllBlogPosts;
