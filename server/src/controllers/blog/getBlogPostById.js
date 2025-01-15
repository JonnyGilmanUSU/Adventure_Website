const BlogPost = require('../../models/BlogPostModel');


const getBlogPostById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the blog post by ID
    const blogPost = await BlogPost.findById(id);

    // If the blog post doesn't exist, return a 404 error
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Respond with the blog post data
    res.status(200).json(blogPost);
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error.message);

    // Handle invalid MongoDB ObjectId errors
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid blog post ID' });
    }

    // Handle other errors
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getBlogPostById;
