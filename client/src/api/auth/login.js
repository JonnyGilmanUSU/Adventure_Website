import axiosInstance from "../axiosInstance";

// Login user and handle API call
export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);

    // Extract token and admin from the response
    const { token, admin, username } = response.data;

    if (!token) {
      throw new Error("Token not provided by server");
    }

    // Return the login data to be handled elsewhere
    return { token, admin, username };
  } catch (err) {
    // Handle error and return a descriptive error message
    throw err.response?.data || { message: "An error occurred during login" };
  }
};
