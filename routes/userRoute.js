const { Router } = require('express')
const { postUserToDb, loginUser, updateProfile, getAllUsers, getUserProfile } = require('../controllers/userController')
const verifyToken = require('../middlewares/authMiddleware')

const userRoute = Router()

userRoute.post('/register', postUserToDb)
userRoute.post('/login', loginUser)
userRoute.post('/updateprofile', verifyToken, updateProfile)
userRoute.post('/getallusers', getAllUsers)
userRoute.get('/getuserprofile', getUserProfile)

module.exports = userRoute