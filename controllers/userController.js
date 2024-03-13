
const { encryptPassword, comparePassword, generateSecretKey } = require('../helpers/encryptionHelper');
const { sendVerificationEmail } = require('../helpers/sendMailHelper');
const userModel = require('../models/userModel');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');

// Register Controller
const userRegisterController = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        //validation
        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'Please Enter Name'
            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Please Enter Email'
            })
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Please Enter Password'
            })
        }
        //existing user check
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: 'Email ID already registered',
            });
        }
        //create a new user
        const encryptedPassword = await encryptPassword(password);
        const newUser = new userModel({ name, email, password: encryptedPassword });

        // Generation and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString('hex');

        // save the user to the database
        await newUser.save();


        //send verification email to the user
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        //sending response after first registration
        res.status(201).send({
            success: true,
            message: "A confirmation email has been send to your Email Id",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in register API',
            error
        });
    }
}
const verifyEmailController = async (req, res) => {
    try {
        const token = req.params.token;
        // Find the user with the given verification token
        const user = await userModel.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Token verification failed',
            });
        }
        // Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).send({
            success: true,
            messag: 'Email verification successful'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Send Email API',
            error,
        })
    }
}

const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await userModel.findOne({ email });
        if (!findUser) {
            return res.status(400).send({
                success: false,
                message: 'Invalid Email or Password',
            });
        }
        const verifyPassword = await comparePassword(password, findUser.password);
        if (!verifyPassword) {
            return res.status(400).send({
                success: false,
                message: 'Invalid Email or Password',
            });
        }
        // Token Generation
        const secretKey = await generateSecretKey();
        const token = await JWT.sign({ _id: findUser._id }, secretKey, { expiresIn: '7d' });
        return res.status(200).send({
            success: true,
            message: 'Login Successful',
            token,
            findUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login API',
            error,
        })
    }
}

const userAddressController = async (req, res) => {
    try {
        const { userId, address } = req.body;
        // Find the user by userid
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        // add the new address to the user's addresses array
        user.addresses.push(address);

        //save the updated user in the backend
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Address Added Successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in user address API',
            error,
        });
    }
}

const userAllAddressesController = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            })
        }
        const addresses = user.addresses;
        res.status(200).send({
            success: true,
            message: 'All addresses of the user fetched',
            addresses,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in user all addresses API',
            error,
        });
    }
}

const userProfileController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).send({
                success: false,
                message: "User not found",
            })
        }
        res.status(200).send({
            success: true,
            message: 'Success in fetching user details',
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in user profile api',
            error,
        })
    }
}
module.exports = { userRegisterController, verifyEmailController, userLoginController, userAddressController, userAllAddressesController, userProfileController };