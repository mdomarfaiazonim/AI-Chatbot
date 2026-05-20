const errorHandler = (err, req, res, next) => {
  // Log for developer visibility
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Something went wrong',
      status:  statusCode,
      // only show stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = errorHandler;



// backend/middleware/errorHandler.js

// const errorHandler = (err, req, res, next) => {

//     console.error(err);

//     let statusCode = err.statusCode || 500;

//     let message = err.message || 'Internal Server Error';



//     // =========================
//     // MONGODB INVALID OBJECT ID
//     // =========================
//     if (err.name === 'CastError') {
//         statusCode = 400;
//         message = 'Invalid resource ID';
//     }



//     // =========================
//     // MONGODB DUPLICATE KEY
//     // =========================
//     if (err.code === 11000) {
//         statusCode = 400;
//         message = 'Duplicate field value';
//     }



//     // =========================
//     // MONGOOSE VALIDATION ERROR
//     // =========================
//     if (err.name === 'ValidationError') {

//         const errors = Object.values(err.errors).map(
//             val => val.message
//         );

//         statusCode = 400;

//         message = errors.join(', ');
//     }



//     // =========================
//     // JWT INVALID TOKEN
//     // =========================
//     if (err.name === 'JsonWebTokenError') {
//         statusCode = 401;
//         message = 'Invalid token';
//     }



//     // =========================
//     // JWT EXPIRED TOKEN
//     // =========================
//     if (err.name === 'TokenExpiredError') {
//         statusCode = 401;
//         message = 'Token expired';
//     }



//     res.status(statusCode).json({
//         success: false,
//         message,

//         // Show stack only in development
//         stack:
//             process.env.NODE_ENV === 'development'
//                 ? err.stack
//                 : undefined
//     });
// };

// module.exports = errorHandler;