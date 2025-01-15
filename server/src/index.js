require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const path = require('path');

// Import Routes
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// CORS Options
const whitelist = ['http://104.250.155.51', 'http://localhost:3001', 'https://adventuresofpigbotandsaydie.com']; // Add allowed origins
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny request
    }
  },
  credentials: true, // Allow cookies or credentials if needed
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Use blogRoutes
app.use('/api/blog-posts', blogRoutes); // Properly set up the route
app.use('/api/upload', uploadRoutes); // Uploading Images
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
