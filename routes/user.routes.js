const express = require('express');
const router = express.Router();
const userConttroller = require('../controllers/user.controller');
const authmiddleware = require('../middleware/auth.middleware');

router.post('/signup',userConttroller.signup);
router.post('/login', userConttroller.login);
router.get('/getAllUsers',userConttroller.getAllUsers);
router.post('/deleteUser', userConttroller.deleteUser);
router.post('/addUserProfile',authmiddleware ,userConttroller.addUserProfile);
module.exports = router;