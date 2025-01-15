// File: /routes/uploadRoutes.js
const express = require('express');
const { uploadFile } = require('../controllers/uploadController/uploadController');

const router = express.Router();

// POST route to handle file uploads
router.post('/', uploadFile);

module.exports = router;
