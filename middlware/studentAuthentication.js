const jwt = require('jsonwebtoken');
const Student = require('../model/studentModel');

exports.verifyStudent = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = await Student.findById(decoded.id);
    if (!req.student) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access' });
  }
};
