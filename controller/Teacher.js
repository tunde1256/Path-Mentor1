require('dotenv').config();
const Teacher = require('../model/teacherModel');
const Material = require('../model/materialModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// // Cloudinary Configuration
//  cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//    api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Teacher Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, subjects } = req.body;

    // Ensure that subjects are provided
    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ message: 'At least one subject must be provided' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      subjects, // Save the subjects taught by the teacher
    });

    await teacher.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering teacher' });
  }
};


// Teacher Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Upload Material
// Upload Material with Subject


  // Upload material function
  exports.uploadMaterial = async (req, res) => {
    try {
      console.log("Files received:", req.files); // Log files to verify receipt
  
      const { title, description, type, subject } = req.body;
      const teacherId = req.teacher._id; // Assuming teacher details are in req.teacher
  
      // Check if video and document files are present in the request
      if (!req.files || !req.files.video || !req.files.document) {
        console.log("Received files:", req.files);
        return res.status(400).json({
          message: 'Both video and document files are required',
          receivedFiles: Object.keys(req.files), // List received files for clarity
        });
      }
  
      console.log("Cloudinary Configuration:", cloudinary.config()); // Log Cloudinary credentials
  
      // Upload files to Cloudinary and get their URLs
      const [videoUpload, documentUpload] = await Promise.all([
        cloudinary.uploader.upload(req.files.video[0].path, {
          resource_type: 'video',
          folder: 'materials/videos',
        }),
        cloudinary.uploader.upload(req.files.document[0].path, {
          resource_type: 'raw', // Explicit for document upload
          folder: 'materials/documents',
        }),
      ]);
  
      console.log('Video Upload Response:', videoUpload); // Log video upload response
      console.log('Document Upload Response:', documentUpload); // Log document upload response
  
      // Find teacher by ID and get their name
      const teacher = await Teacher.findById(teacherId).select('name'); // Select only the name field
  
      // Check if teacher is found
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      // Create a new Material document
      const material = new Material({
        title,
        description,
        teacher: teacherId,
        videoUrl: videoUpload.secure_url,
        documentUrl: documentUpload.secure_url,
        type,
        subject,
      });
  
      // Save material and update teacher's materials array
      await material.save();
      await Teacher.findByIdAndUpdate(teacherId, { $push: { materials: material._id } });
  
      return res.status(201).json({
        message: 'Material uploaded successfully',
        material,
        teacherName: teacher.name, // Include teacher's name in the response
      });
    } catch (error) {
      console.error("File upload error:", error.response || error); // Log full error
  
      return res.status(500).json({
        message: 'Unexpected error during file upload',
        error: error.message || 'Unknown error',
      });
    }
  };
  
    
// Update Material with Cloudinary
exports.updateMaterial = async (req, res) => {
  try {
    const { title, description } = req.body;
    const materialId = req.params.id;

    const updates = { title, description };

    if (req.files) {
      // Check if new video or document is provided
      if (req.files.video) {
        const videoUpload = await cloudinary.uploader.upload(req.files.video[0].path, { resource_type: 'video', folder: 'materials/videos' });
        updates.videoUrl = videoUpload.secure_url;
      }
      if (req.files.document) {
        const documentUpload = await cloudinary.uploader.upload(req.files.document[0].path, { folder: 'materials/documents' });
        updates.documentUrl = documentUpload.secure_url;
      }
    }

    const material = await Material.findByIdAndUpdate(materialId, updates, { new: true });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json({ message: 'Material updated successfully', material });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating material' });
  }
};

// Get All Materials
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ teacher: req.teacher._id });
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching materials' });
  }
};

// Get Material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching material' });
  }
};

// Delete Material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await Teacher.findByIdAndUpdate(req.teacher._id, { $pull: { materials: material._id } });

    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting material' });
  }
};
// Get Materials by Subject
exports.getMaterialsBySubject = async (req, res) => {
    try {
      const { subject } = req.query; // Get subject from query parameter
      const materials = await Material.find({ subject });
  
      if (!materials || materials.length === 0) {
        return res.status(404).json({ message: `No materials found for ${subject}` });
      }
  
      res.status(200).json({ materials });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching materials by subject' });
    }
  };
  exports.changePassword = async (req, res) => {
    try {
        // Find teacher by ID from route parameter
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Ensure currentPassword and newPassword are provided in request body
        if (!req.body.currentPassword) {
            return res.status(400).json({ error: 'Current password is required' });
        }
        if (!req.body.newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(req.body.currentPassword, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Hash and update the new password
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        teacher.password = hashedPassword;
        await teacher.save();

        return res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Password change error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
