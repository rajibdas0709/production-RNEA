const express = require('express');
const { userRegisterController, verifyEmailController, userLoginController, userAddressController, userAllAddressesController, userProfileController } = require('../controllers/userController');

const router = express.Router();

// User Register Router
router.post('/user-register', userRegisterController);
// Endpoint to verify the email
router.get('/verify/:token', verifyEmailController);

// User Login Router
router.post('/user-login', userLoginController);

// User Address
router.post("/add-user-address", userAddressController);

// All the Addresses of a user
router.get('/user-addresses/:userId', userAllAddressesController);
// Get the user Profile
router.get("/user-profile/:userId", userProfileController);


module.exports = router;