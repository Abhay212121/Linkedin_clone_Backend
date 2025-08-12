const { Router } = require('express')
const { postUserToDb, loginUser, updateProfile, getAllUsers, getUserProfile, updateUserPfp, getUserPfp } = require('../controllers/userController')
const verifyToken = require('../middlewares/authMiddleware')
const multer = require('multer')

const userRoute = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage })

userRoute.post('/register', postUserToDb)
userRoute.post('/login', loginUser)
userRoute.post('/updateprofile', verifyToken, updateProfile)
userRoute.post('/updateuserpfp', verifyToken, upload.single('image'), updateUserPfp)
userRoute.get('/getpfp', verifyToken, getUserPfp)
userRoute.post('/getallusers', getAllUsers)
userRoute.get('/getuserprofile', verifyToken, getUserProfile)

module.exports = userRoute