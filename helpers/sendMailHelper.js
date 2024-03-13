const nodeMailer = require('nodemailer');

// Function to send Verification Email to the user
const sendVerificationEmail = async (email, verificationToken) => {
    // Create a nodemailer transport
    const transporter = nodeMailer.createTransport({
        // configure the email service
        service: 'gmail',
        auth: {
            user: "rajibdas0709@gmail.com",
            pass: 'mcxb wckq xdyp hpnm',
        }
    })
    //compose the Email Message
    const mailOptions = {
        from: 'React Native E-commerce App',
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email : http://localhost:8080/api/v1/auth/verify/${verificationToken}`
    }

    //send the email 
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error sending verificaion email', error);
    }
}

module.exports = { sendVerificationEmail };