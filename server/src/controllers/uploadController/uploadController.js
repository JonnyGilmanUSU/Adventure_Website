const heicConvert = require("heic-convert");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
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

// File filter for allowed types
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
    "video/quicktime",
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
    ".mov",
  ];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtensionValid = allowedExtensions.includes(fileExtension);

  if (isMimeTypeValid || isExtensionValid) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."));
  }
};

// Multer instance for handling multiple files
const uploadMultiple = multer({ storage, fileFilter }).array("files");

// Controller for uploading files
const uploadFiles = async (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "Failed to upload files" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    try {
      const urls = [];
      for (const file of req.files) {
        let filePath = file.path;

        // Handle HEIC image conversion
        if (
          file.mimetype.startsWith("image/") &&
          (file.mimetype === "image/heic" ||
            file.mimetype === "image/heif" ||
            path.extname(file.originalname).toLowerCase() === ".heic")
        ) {
          const inputBuffer = fs.readFileSync(file.path);
          const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: "JPEG",
            quality: 1,
          });

          const convertedFilePath = file.path.replace(/\.heic|\.heif/, ".jpeg");
          fs.writeFileSync(convertedFilePath, outputBuffer);

          // Remove the original HEIC file
          fs.unlinkSync(file.path);

          filePath = convertedFilePath;
        }

        urls.push(`/uploads/${path.basename(filePath)}`);
      }

      res.status(200).json({ urls });
    } catch (error) {
      console.error("Error processing files:", error);
      return res.status(500).json({ error: "Failed to process files" });
    }
  });
};

module.exports = { uploadFiles };
