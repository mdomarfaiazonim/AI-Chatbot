// backend/middleware/authorize.js

const authorize = (...roles) => {

    return (req, res, next) => {

        // req.user comes from protect middleware
        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        next();
    };
};

module.exports = authorize;