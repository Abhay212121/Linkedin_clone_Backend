const { Router } = require('express')
const { createPost, getPosts, updateLike, getPostData, getcomments, addNewComment } = require('../controllers/postController')
const verifyToken = require('../middlewares/authMiddleware')
const multer = require('multer')

const postRoute = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage })

postRoute.post('/create', verifyToken, upload.single('image'), createPost)
postRoute.get('/getposts', verifyToken, getPosts)
postRoute.post('/updatelike', verifyToken, updateLike)
postRoute.get('/getpostdata', getPostData)
postRoute.get('/getcomments', getcomments)
postRoute.post('/addcomment', verifyToken, addNewComment)

module.exports = postRoute