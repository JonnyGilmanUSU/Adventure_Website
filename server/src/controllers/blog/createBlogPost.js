const BlogPost = require('../../models/BlogPostModel'); // Import the BlogPost model

// Controller to create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error in createBlogPost:", err);
    res.status(400).json({ error: err.message });
  }
};


module.exports = createBlogPost;
  