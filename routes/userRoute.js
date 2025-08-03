const { Router } = require('express')
const { postUserToDb, loginUser, updateProfile } = require('../controllers/userController')
const verifyToken = require('../middlewares/authMiddleware')

const userRoute = Router()

userRoute.post('/register', postUserToDb)
userRoute.post('/login', loginUser)
userRoute.post('/updateprofile', verifyToken, updateProfile)

module.exports = userRoute