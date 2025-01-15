const BlogPost = require('../../models/BlogPostModel'); // Ensure correct path

// Fetch blog posts by category
const getBlogPostByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const posts = await BlogPost.find({ 'metadata.category': category.toLowerCase() });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ error: 'Failed to fetch posts by category' });
  }
};

// Export the function directly
module.exports = getBlogPostByCategory;
