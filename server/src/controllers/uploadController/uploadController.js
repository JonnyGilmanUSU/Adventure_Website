const heicConvert = require('heic-convert');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/heic",
    "image/heif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime", // Added MIME type for .mov files
  ];

  const allowedExtensions = [
    ".jpeg",
    ".jpg",
    ".png",
    ".gif",
    ".heic",
    ".heif",
    ".mp4",
    ".webm",
    ".ogg",
    ".mov", // Added .mov file extension
  ];

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtensionValid = allowedExtensions.includes(fileExtension);

  console.log("MIME type:", file.mimetype);
  console.log("File extension:", fileExtension);

  if (isMimeTypeValid || isExtensionValid) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."));
  }
};

const upload = multer({ storage, fileFilter }).single('file');

// Function to optimize video files
const optimizeVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264', // Use H.264 codec
        '-preset slow', // Balance between compression and speed
        '-crf 28', // Compression level (lower is better quality, 28 is reasonable for compression)
        '-b:v 1M', // Set bitrate to 1Mbps
        '-maxrate 1M', // Max bitrate
        '-bufsize 2M', // Buffer size
        '-c:a aac', // Use AAC codec for audio
        '-b:a 128k', // Set audio bitrate
      ])
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .save(outputPath); // Save the optimized file
  });
};

const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const filePath = req.file.path;

    try {
      // Optimize videos if the uploaded file is a video
      if (req.file.mimetype.startsWith("video/")) {
        const optimizedPath = filePath.replace(path.extname(filePath), '-optimized.mp4');
        
        await optimizeVideo(filePath, optimizedPath);

        // Remove the original unoptimized video
        fs.unlinkSync(filePath);

        // Update the filename and file path to point to the optimized video
        req.file.filename = path.basename(optimizedPath);
        req.file.path = optimizedPath;
      }

      // Handle HEIC image conversion (as in the original code)
      if (
        req.file.mimetype.startsWith("image/") &&
        (req.file.mimetype === "image/heic" ||
          req.file.mimetype === "image/heif" ||
          path.extname(req.file.originalname).toLowerCase() === ".heic")
      ) {
        const inputBuffer = fs.readFileSync(req.file.path);
        const outputBuffer = await heicConvert({
          buffer: inputBuffer,
          format: "JPEG",
          quality: 1,
        });

        const convertedFilePath = req.file.path.replace(/\.heic|\.heif/, ".jpeg");
        fs.writeFileSync(convertedFilePath, outputBuffer);

        // Remove the original HEIC file
        fs.unlinkSync(req.file.path);

        req.file.filename = path.basename(convertedFilePath);
      }

      res.status(200).json({ url: `/uploads/${req.file.filename}` });
    } catch (error) {
      console.error("Error processing file:", error);
      return res.status(500).json({ error: "Failed to process file" });
    }
  });
};

module.exports = { uploadFile };
