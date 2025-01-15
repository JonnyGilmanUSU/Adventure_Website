const BlogPost = require('../../models/BlogPostModel'); // Import the BlogPost model

// Controller to edit an existing blog post
const editBlogPost = async (req, res) => {
  const { id } = req.params; // Get the ID from the route parameters

  try {
    // Find the blog post by ID and update it with the new data
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { $set: req.body }, // Update the fields with the request body
      { new: true, runValidators: true } // Return the updated document and apply validation
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json(updatedPost); // Return the updated blog post
  } catch (err) {
    console.error("Error in editBlogPost:", err);
    res.status(400).json({ error: err.message }); // Handle errors
  }
};

module.exports = editBlogPost;
