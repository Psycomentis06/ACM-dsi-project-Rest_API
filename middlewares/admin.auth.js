const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Middleware for normal user auth
    try {
        const whiteRoles = ['ROLE_ADMIN', 'ROLE_SUPERADMIN'];
        tokenHeader = req.header('Authorization').split(' ')[1];
        const tokenData = jwt.verify(tokenHeader, process.env.JWT_KEY);
        // check permission
        if (whiteRoles.includes(tokenData.role)) {
            // valid permission
            req.body.tokenData = tokenData;
            next();
        } else {
            res.status(401).json({
                valid: false,
                message: 'Wrong privileges'
            });
        }

    } catch (err) {
        res.status(401).json({
            valid: false,
            message: "Auth error"
        });
    }
}