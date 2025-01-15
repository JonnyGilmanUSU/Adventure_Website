const express = require('express');
const { createLocation, getAllLocations, getLocationByName } = require('../controllers/location/location');

const router = express.Router();

// Define routes and map them to controller functions
router.post('/', createLocation); // Create a new location
router.get('/', getAllLocations); // Get all locations
router.get('/:name', getLocationByName); // Get a location by name

module.exports = router;
