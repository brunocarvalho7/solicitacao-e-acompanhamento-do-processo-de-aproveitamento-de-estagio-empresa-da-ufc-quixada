const jwt = require('jsonwebtoken');
const { privateKey } = require('./../config/config').token;

function verify(token) {
    return jwt.verify(token, privateKey);
}

function generateAuthToken(userId, userName, userEmail) {
    return jwt.sign({ 
        _id: userId, 
        name: userName, 
        email: userEmail 
    }, privateKey);
}

module.exports = {
    verify: verify,
    generateAuthToken: generateAuthToken
};
