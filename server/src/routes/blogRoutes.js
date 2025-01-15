const express = require('express');
const createBlogPost = require('../controllers/blog/createBlogPost');
const getAllBlogPosts = require('../controllers/blog/getAllBlogPosts');
const getBlogPostByCategory = require('../controllers/blog/getBlogPostByCategory');
const getBlogPostById = require('../controllers/blog/getBlogPostById');
const deleteBlogPost = require('../controllers/blog/deleteBlogPost');
const editBlogPost = require('../controllers/blog/editBlogPost'); // Import the controller


const router = express.Router();

// Define routes and map them to controller functions
router.post('/', createBlogPost); // Create a new blog post
router.get('/', getAllBlogPosts); // Get all blog posts
router.get('/category/:category', getBlogPostByCategory); // Fetch blog posts by category
router.get('/:id', getBlogPostById); // Fetch a blog post by ID
router.delete('/:id', deleteBlogPost); // Delete a blog post by ID
router.put('/edit/:id', editBlogPost); // Edit Blog Post


module.exports = router;