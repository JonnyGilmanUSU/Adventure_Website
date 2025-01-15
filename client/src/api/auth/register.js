import axiosInstance from "../../api/axiosInstance";

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "An error occurred" };
  }
};
