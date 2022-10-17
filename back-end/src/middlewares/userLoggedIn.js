const tokenUtils = require('./../utils/tokenUtils');

exports.validateLoggedIn = function (req, res, next) {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = tokenUtils.verify(token);

        req.userData = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Falha na autenticação!"
        });
    }
}
