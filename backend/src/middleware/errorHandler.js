const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Sunucu hatası oluştu',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.error.code = 'VALIDATION_ERROR';
    error.error.message = 'Geçersiz veri';
    error.error.details = Object.values(err.errors).map(val => val.message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.error.code = 'DUPLICATE_KEY_ERROR';
    error.error.message = 'Bu kayıt zaten mevcut';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.error.code = 'INVALID_TOKEN';
    error.error.message = 'Geçersiz token';
  }

  if (err.name === 'TokenExpiredError') {
    error.error.code = 'TOKEN_EXPIRED';
    error.error.message = 'Token süresi dolmuş';
  }

  // Custom error
  if (err.isOperational) {
    error.error.code = err.code;
    error.error.message = err.message;
    error.error.details = err.details;
  }

  res.status(err.statusCode || 500).json(error);
};

module.exports = errorHandler;
