const Location = require('../../models/LocationModel'); // Import the Location model

// Controller for creating a new location
const createLocation = async (req, res) => {
  const { locationName, image, paragraphs } = req.body;

  if (!locationName || !image || !paragraphs || paragraphs.length !== 2) {
    return res.status(400).json({ error: 'All fields are required, including exactly 2 paragraphs.' });
  }

  try {
    // Check if location already exists
    const existingLocation = await Location.findOne({ name: locationName.toLowerCase() });
    if (existingLocation) {
      return res.status(400).json({ error: 'Location already exists.' });
    }

    // Create and save the new location
    const newLocation = new Location({
      name: locationName.toLowerCase(),
      image,
      paragraphs,
    });

    await newLocation.save();
    res.status(201).json({ message: 'Location created successfully.', location: newLocation });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location. Please try again.' });
  }
};

// Controller for getting all locations
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations. Please try again.' });
  }
};

// Controller for getting a location by name
const getLocationByName = async (req, res) => {
  const { name } = req.params;

  try {
    const location = await Location.findOne({ name: name.toLowerCase() });
    if (!location) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error(`Error fetching location with name ${name}:`, error);
    res.status(500).json({ error: 'Failed to fetch location. Please try again.' });
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationByName,
};
