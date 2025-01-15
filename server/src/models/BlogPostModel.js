// models/BlogPost.js
const mongoose = require('mongoose');

const TextSectionSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Text content for each section
});

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true }, // URL for images
  alt: { type: String, default: '' }, // Optional alt text
});

const GearItemSchema = new mongoose.Schema({
  item: { type: String, required: true }, // Name of the gear item
  description: { type: String, required: true }, // Description of the gear item
});

const RouteSectionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // "Approach", "Canyon", or "Exit"
  content: [TextSectionSchema], // Multiple text sections within each route sub-section
});

const SectionSchema = new mongoose.Schema({
  intro: {
    title: { type: String },
    imageUrl: { type: String },
    date: { type: Date },
  },
  overview: {
    routeName: { type: String },
    length: { type: String },
    rating: { type: String },
    rappels: { type: String },
    images: [ImageSchema], // List of overview images
    content: [TextSectionSchema], // Multiple text sections
  },
  gear: {
    content: [TextSectionSchema], // Description of the gear section
    items: [GearItemSchema], // List of gear items
  },
  route: {
    sections: [RouteSectionSchema], // "Approach", "Canyon", "Exit"
  },
  photos: {
    gallery: [ImageSchema], // Gallery images
  },
});

const BlogPostSchema = new mongoose.Schema({
  metadata: {
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }, // Post status
    tags: [String], // Array of tags
    publishedDate: { type: Date },
    category: { type: String },
    location: { type: String },
    slug: { type: String, unique: true, required: true }, // Unique slug for the post
    coordinates: { // New field for geographic coordinates
      lat: { type: Number, required: false }, // Latitude
      lng: { type: Number, required: false }, // Longitude
    },
  },
  sections: [SectionSchema], // Array of sections without "type"
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);