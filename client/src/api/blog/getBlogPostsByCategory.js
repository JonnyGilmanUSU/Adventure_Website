import axiosInstance from "../axiosInstance";

// Function to fetch blog posts by category
const getPostsByCategory = async (category) => {
    try {
      const response = await axiosInstance.get(`/blog-posts/category/${category}`);
      return response.data; // Return the data from the response
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      throw error; // Rethrow error to handle it in the caller
    }
  };
  
  export default getPostsByCategory;