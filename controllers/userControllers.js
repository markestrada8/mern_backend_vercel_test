const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const userSignup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const userExists = await User.findOne({email: req.body.email})
  
  if (!name || !email || !password) {
    res.status(400)
    throw new Error("No empty fields allowed")
  }

  if (userExists) {
    res.status(500)
    throw new Error("User exists already")
  }

  const validate = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!validate.test(email)) {
    res.status(400)
    throw new Error("Enter correct email")
  }
  const newUser = new User({
    name,
    email,
    password: hashPassword
  })
  
  newUser.save()
  res.status(200).json({
    _id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token: generateToken(newUser.email)
  })
})

const userSignin = asyncHandler(async (req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({email})
  
  if (!user) {
    res.status(400)
    throw new Error("User does not exist, please register")
  }
  
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  
  if (user && isPasswordCorrect) {
    res.status(200).json({
      name: user.name,
      email: user.email,
      token: generateToken(user.email)
    })
  }
  else {
    res.status(400)
    throw new Error("Enter correct credentials")
  }
})

const getMe = asyncHandler((req, res) => {
  if (!req.user) {
    res.status(401)
    throw new Error("User does not exist")
  }
  res.status(200).json(req.user)
})

const generateToken = (email) => {
  return jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

module.exports = {
  userSignup,
  userSignin,
  getMe,
  
}