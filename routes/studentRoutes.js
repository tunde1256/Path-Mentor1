const express = require('express');
const router = express.Router();
const studentController = require('../controller/student');
const auth = require('../middlware/studentAuthentication');

 router.post('/register', studentController.register);
 router.post('/login', studentController.login);
 router.get('/profile', auth.verifyStudent, studentController.getProfile);
 router.put('/profile', auth.verifyStudent, studentController.updateProfile);
 router.delete('/profile', auth.verifyStudent, studentController.deleteAccount);
 router.get('/materials', auth.verifyStudent, studentController.getMaterialsBySubject);

module.exports = router;
