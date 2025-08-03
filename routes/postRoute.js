const { Router } = require('express')
const { createPost, getPosts, updateLike } = require('../controllers/postController')
const verifyToken = require('../middlewares/authMiddleware')

const postRoute = Router()

postRoute.post('/create', verifyToken, createPost)
postRoute.get('/getposts', verifyToken, getPosts)
postRoute.post('/updatelike', verifyToken, updateLike)

module.exports = postRoute