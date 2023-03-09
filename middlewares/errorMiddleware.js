const errorHandler = (err, req, res, next) => {
  res.statusCode ? res.statusCode : 500

  res.json({
    message: err.message,
    stack: err.stack
  })
}

module.exports = errorHandler