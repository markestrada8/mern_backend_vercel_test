const express = require('express')
const router = express.Router()
const { userSignup, userSignin, getMe, editMe } = require('../controllers/userControllers')
const protect = require('../middlewares/authMiddleware')


router.post('/', userSignup)
router.post('/login', userSignin)
router.get('/me', protect, getMe)

module.exports = router