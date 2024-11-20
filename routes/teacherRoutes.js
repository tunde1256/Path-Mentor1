const express = require('express');
const router = express.Router();
const teacherController = require('../controller/Teacher');
const { upload, handleError } = require('../middlware/Upload'); // Correct path to your upload.js
const auth = require('../middlware/authentication'); // Authentication middleware

// Authentication Routes
router.post('/register', teacherController.register);
router.post('/login', teacherController.login);

// CRUD Routes for Material
router.post('/material-upload', auth.verifyTeacher, upload, teacherController.uploadMaterial);
router.get('/material', auth.verifyTeacher, teacherController.getMaterials);
router.get('/material/:id', auth.verifyTeacher, teacherController.getMaterialById);
router.put('/material/:id', auth.verifyTeacher, teacherController.updateMaterial);
router.delete('/material/:id', auth.verifyTeacher, teacherController.deleteMaterial);
router.post('/forgotpassword/:id', teacherController.changePassword)

// Handle Multer and other errors
router.use(handleError); // Make sure this middleware is added at the end of the route definitions.

module.exports = router;
