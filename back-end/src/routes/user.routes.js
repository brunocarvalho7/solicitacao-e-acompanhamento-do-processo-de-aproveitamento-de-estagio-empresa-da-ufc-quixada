const express = require('express');
const userController = require('../controllers/user');
const userLoggedIn = require('../middlewares/userLoggedIn');

const router = express.Router();

router.post('/register', userController.registerNewUser);
router.post('/login', userController.loginUser);
router.get('/profile', userLoggedIn.validateLoggedIn, userController.returnUserProfile);

module.exports = router;
