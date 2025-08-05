const db = require('../db/queries')

const createPost = async (req, res) => {
    const userId = req.user_id
    const postContent = req.body.postContent
    try {
        await db.savePostInDb(userId, postContent)
        return res.json({ status: 200, msg: 'doen' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const getPosts = async (req, res) => {
    const email = req.user_mail
    try {
        const user = await db.getUserFromDb(email)
        if (!user[0].user_jobrole) {
            return res.json({ status: 404, msg: 'Registration Not complete!' })
        }
        const postsArr = await db.getAllPosts()
        return res.json({ status: 200, posts: postsArr })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const updateLike = async (req, res) => {
    const { postId, like } = req.body;

    try {
        const countChange = like ? 1 : -1;
        await db.updateLike(countChange, postId)
        return res.json({ status: 200, msg: "Like updated" });
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
};

const getPostData = async (req, res) => {
    const postId = req.query.postId
    try {
        const postData = await db.getPostDataById(postId)
        return res.json({ status: 200, post: postData })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const getcomments = async (req, res) => {
    const id = req.query.postId
    try {
        const commentsArr = await db.getCommentsByPostId(id)
        return res.json({ status: 200, commentsArr: commentsArr })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const addNewComment = async (req, res) => {
    const userId = req.user_id
    const comment = req.body.newComment
    const postId = req.body.postId
    try {
        await db.addNewComment(postId, comment, userId)
        return res.json({ status: 200, msg: 'Success' })
    } catch (error) {
        return json({ status: 500, msg: error.message })
    }
}

module.exports = { createPost, getPosts, updateLike, getPostData, getcomments, addNewComment }