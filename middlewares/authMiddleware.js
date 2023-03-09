const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler (async (req, res, next) => {
  let token
  try {
    if (req.headers && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
  
      req.user = await User.findOne({email: decoded.email}).select('-password')
      next()
    }
  } catch {
    res.status(400)
    throw new Error("Not authorized")
  }

  if (!token) {
    res.status(400)
    throw new Error("Not authorized, no token sent")
  }
})

module.exports = protect