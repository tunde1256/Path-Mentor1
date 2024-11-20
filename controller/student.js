const Student = require('../model/studentModel');
const Material = require('../model/materialModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Student Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, enrolledSubjects } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const student = new Student({
      name,
      email,
      password,
      enrolledSubjects,
    });

    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering student' });
  }
};

// Student Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Get Student Profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update Student Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, enrolledSubjects } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      { name, enrolledSubjects },
      { new: true }
    ).select('-password');

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Delete Student Account
exports.deleteAccount = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.student._id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};

// Get Materials by Subject
exports.getMaterialsBySubject = async (req, res) => {
  try {
    const { subject } = req.query; // Query parameter for subject
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
      const teacher = await Student.findById(req.params.id);

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
      const isMatch = await bcrypt.compare(req.body.currentPassword, Student.password);
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