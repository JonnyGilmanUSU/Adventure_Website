// File: /routes/uploadRoutes.js
const express = require('express');
const { uploadFiles } = require('../controllers/uploadController/uploadController');

const router = express.Router();

// POST route to handle file uploads
router.post('/multiple', uploadFiles);

module.exports = router;
