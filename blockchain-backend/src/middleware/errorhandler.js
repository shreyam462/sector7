const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
};

module.exports = errorHandler;