import axiosInstance from "../axiosInstance";

export const createLocation = async (locationData) => {
  try {
    const response = await axiosInstance.post('/locations', locationData);
    return response.data;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};


export const getAllLocations = async () => {
  try {
    const response = await axiosInstance.get('/locations');
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const getLocationByName = async (name) => {
  try {
    const response = await axiosInstance.get(`/locations/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching location by name:', error);
    throw error;
  }
};
