const bcrypt = require('bcrypt');
const crypto = require('crypto');
const encryptPassword = async (password) => {
    try {
        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        return encryptedPassword;
    } catch (error) {
        console.log(error);
    }
}

const comparePassword = async (password, encryptedPassword) => {
    return bcrypt.compare(password, encryptedPassword);
}

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
}
module.exports = { encryptPassword, comparePassword, generateSecretKey };