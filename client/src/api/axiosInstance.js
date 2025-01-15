// File: src/api/axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Base URL from .env
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;
