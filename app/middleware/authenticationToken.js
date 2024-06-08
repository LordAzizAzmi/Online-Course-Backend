require('dotenv')
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../error/ErrorHandler');

exports.authenticationToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        
        if (!token) {
            throw new ErrorHandler('Autentikasi gagal', 401);
        }

        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;

        next();

    } catch (err) {
        throw new ErrorHandler('Autentikasi gagal', 401)
    }
};