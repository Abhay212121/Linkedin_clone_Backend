const { Router } = require('express')
const { postUserToDb, loginUser, updateProfile, getAllUsers } = require('../controllers/userController')
const verifyToken = require('../middlewares/authMiddleware')

const userRoute = Router()

userRoute.post('/register', postUserToDb)
userRoute.post('/login', loginUser)
userRoute.post('/updateprofile', verifyToken, updateProfile)
userRoute.post('/getallusers', getAllUsers)

module.exports = userRoute