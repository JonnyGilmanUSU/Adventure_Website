const BlogPost = require('../../models/BlogPostModel'); // Import the BlogPost model

// Controller to get all blog posts
const getAllBlogPosts = async (req, res) => {
  try {
    // Extract query parameters for filtering and sorting
    const { sort = 'publishedDate', order = 'desc', status, category, tags } = req.query;

    // Build the filter object dynamically
    const filter = {};
    if (status) filter['metadata.status'] = status;
    if (category) filter['metadata.category'] = category;
    if (tags) filter['metadata.tags'] = { $in: tags.split(',') }; // Match any of the tags

    // Retrieve blog posts with filters and sorting
    const posts = await BlogPost.find(filter)
      .sort({ [sort]: order === 'asc' ? 1 : -1 });

    // Return the retrieved posts
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle server errors
  }
};

module.exports = getAllBlogPosts;
