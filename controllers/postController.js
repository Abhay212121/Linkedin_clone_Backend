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
        console.log(user[0].user_jobrole)
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


module.exports = { createPost, getPosts, updateLike }