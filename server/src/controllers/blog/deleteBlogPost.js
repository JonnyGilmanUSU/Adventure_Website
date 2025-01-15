const BlogPost = require('../../models/BlogPostModel');
const fs = require('fs');
const path = require('path');

const deleteBlogPost = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      console.log(`[DEBUG] Blog post with ID ${id} not found.`);
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Collect all image URLs to delete
    const imagesToDelete = [];

    // Add the intro image
    if (blogPost.sections[0]?.intro?.imageUrl) {
      imagesToDelete.push(blogPost.sections[0].intro.imageUrl);
    }

    // Add overview images
    if (blogPost.sections[0]?.overview?.images) {
      blogPost.sections[0].overview.images.forEach((image) => {
        imagesToDelete.push(image.url);
      });
    }

    // Add gallery images
    if (blogPost.sections[0]?.photos?.gallery) {
      blogPost.sections[0].photos.gallery.forEach((image) => {
        imagesToDelete.push(image.url);
      });
    }

    console.log('[DEBUG] Images to delete:', imagesToDelete);

    // Delete all collected images
    const successfullyDeletedImages = [];
    const failedToDeleteImages = [];

    imagesToDelete.forEach((imageUrl) => {
      const fileName = imageUrl.replace('/uploads/', ''); // Remove the `/uploads/` prefix
      const filePath = path.join(__dirname, '../../uploads', fileName); // Resolve the full path

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`[ERROR] Failed to delete file: ${filePath}`, err.message);
          failedToDeleteImages.push(fileName);
        } else {
          console.log(`[SUCCESS] Deleted file: ${filePath}`);
          successfullyDeletedImages.push(fileName);
        }
      });
    });

    // Wait for the asynchronous file deletions to complete
    setTimeout(() => {
      console.log('[DEBUG] Successfully deleted images:', successfullyDeletedImages);
      console.log('[DEBUG] Failed to delete images:', failedToDeleteImages);
    }, 100); // Short delay to ensure all deletions are logged

    // Delete the blog post
    await BlogPost.findByIdAndDelete(id);
    console.log(`[DEBUG] Blog post with ID ${id} deleted successfully.`);

    res.status(200).json({
      message: 'Blog post and associated images deleted successfully',
      successfullyDeletedImages,
      failedToDeleteImages,
    });
  } catch (error) {
    console.error('[ERROR] Error deleting blog post:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid blog post ID' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = deleteBlogPost;
