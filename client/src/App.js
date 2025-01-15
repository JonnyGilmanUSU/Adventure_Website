// Import Libraries
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "leaflet/dist/leaflet.css";


// Import Utilities
import axiosInstance from './api/axiosInstance';

// Import Pages
import HomePage from './Pages/HomePage/HomePage';
import AdventuresPage from './Pages/AdventuresPage/AdventuresPage'; // For /all-adventures
import CategoriesPage from './Pages/CategoriesPage/CategoriesPage'; // For /adventure-categories
import LocationsPage from './Pages/LocationsPage/LocationsPage'; // For /adventure-locations
import BlogPost from './Components/BlogPosts/BlogPost/BlogPost';
import LoginPage from './Pages/LoginPage/LoginPage'; // For /login
import AdminPage from './Pages/AdminPage/AdminPage';
import CategoryPage from './Pages/CategoryPage/CategoryPage';
import LocationPage from './Pages/LocationPage/LocationPage';
import CreateBlogPost from './Components/Admin/CreateBlogPost/CreateBlogPost';
import ManageBlogPosts from './Components/Admin/ManageBlogPosts/ManageBlogPosts';

// Import Components
import Layout from './Layout/Layout';
import RegisterPage from './Pages/RegisterPage/RegisterPage';

// Import Context
import AppProvider from './context/AppProvider';
import MapPage from './Pages/MapPage/MapPage';

// Define loaders and actions for specific routes
const adminAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Example: Sending data to backend using Axios
  try {
    const response = await axiosInstance.post('/blog-posts', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create blog post');
  }
};

// Create a router with routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // HomePage is not wrapped with Layout
  },
  {
    path: "/login",
    element: <LoginPage />, // LoginPage is not wrapped with Layout
  },
  {
    path: "/register",
    element: <RegisterPage />, // LoginPage is not wrapped with Layout
  },
  {
    path: "/", // Use Layout for all other pages
    element: <Layout />,
    children: [
      { path: "/all-adventures", element: <AdventuresPage /> },
      { path: "/adventure-categories", element: <CategoriesPage /> },
      { path: "/adventure-categories/:category", element: <CategoryPage /> }, // Dynamic category route
      { path: "/adventure-locations", element: <LocationsPage /> },
      { path:"/location/:location", element: <LocationPage />},
      { path: "/adventure-details/:id", element: <BlogPost /> },
      { path: "/admin", element: <AdminPage /> }, // Admin wrapped in Layout
      { path: "/admin/blog-posts", element: <ManageBlogPosts /> },
      { path: "/admin/blog-posts/create", element: <CreateBlogPost /> },
      { path: "/admin/blog-posts/edit/:id", element: <CreateBlogPost isEdit={true} /> },
      { path: "/map", element: <MapPage /> },

    ],
  },
]);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}

export default App;
