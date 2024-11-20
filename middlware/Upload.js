require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set a file size limit (Increase if needed, 50MB in this case)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'materials/documents'; // Default folder for documents
    let allowedFormats = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'mp4'];

    // Check for video file type
    if (file.mimetype.includes('video')) {
      folder = 'materials/videos';
      allowedFormats = ['mp4', 'mov', 'avi']; // Allowed video formats
    }
    // Check for document file type (e.g., PDFs, Word files)
    else if (file.mimetype.includes('application')) {
      folder = 'materials/documents';
      allowedFormats = ['pdf', 'doc', 'docx']; // Allowed document formats
    }
    // Check for image file type
    else if (file.mimetype.includes('image')) {
      folder = 'materials/images';
      allowedFormats = ['jpg', 'jpeg', 'png']; // Allowed image formats
    } else {
      throw new Error('Unsupported file type'); // Error for unsupported files
    }

    return {
      folder: folder,
      allowed_formats: allowedFormats,
      resource_type: file.mimetype.includes('video') ? 'video' : file.mimetype.includes('image') ? 'image' : 'raw',
      public_id: `${file.fieldname}_${Date.now()}`, // Ensure unique public_id
    };
  },
});

// Multer configuration for handling multiple files
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // File size limit
  fileFilter: (req, file, cb) => {
    const isValidType =
      file.mimetype.includes('video') ||
      file.mimetype.includes('application') ||
      file.mimetype.includes('image');

    if (!isValidType) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file)); // Reject unsupported file types
    }
    cb(null, true); // Accept the file
  },
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]);

// Error handling middleware for Multer errors
const handleError = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // If it's a MulterError (such as file size limit)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'File upload error',
      error: err.message,
      code: err.code, // Optional: provides error code details from Multer
    });
  }

  // General error handling for other types of errors
  if (err) {
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: err.message || 'Unknown error',
    });
  }

  next(); // Pass to next middleware if no errors
};

module.exports = { upload, handleError };
