const pool = require('./pool')

const addUserToDb = async (userName, userMail, userPassword) => {
    try {
        await pool.query(`INSERT INTO users(user_name,user_mail,user_password) VALUES($1,$2,$3)`, [userName, userMail, userPassword])
    } catch (error) {
        console.log(error.message)
    }
}

const getUserFromDb = async (email) => {
    const { rows } = await pool.query(`SELECT * FROM users WHERE user_mail = ($1)`, [email])
    return rows
}

const savePostInDb = async (userId, postContent) => {
    try {
        await pool.query(`INSERT INTO posts(user_id,post_content) VALUES($1,$2)`, [userId, postContent])
    } catch (error) {
        console.log(error.message)
    }

}

const getAllPosts = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT posts.*, users.user_name, users.user_jobrole, users.user_mail 
        FROM posts 
        JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.created_at DESC
      `);
        return rows;
    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
};

const updateUserProfile = async (job, email) => {
    try {
        await pool.query(`UPDATE users SET user_jobrole = $1 WHERE user_mail = $2`, [job, email])
        console.log('done')
    } catch (error) {
        console.log(error.message)
    }
}

const updateLike = async (countChange, postId) => {
    await pool.query(
        `UPDATE posts SET like_count = like_count + $1 WHERE post_id = $2`,
        [countChange, postId]
    );
}

const getPostDataById = async (id) => {
    try {
        const { rows } = await pool.query(`
        SELECT posts.*, users.user_name, users.user_jobrole, users.user_mail 
        FROM posts 
        JOIN users ON posts.user_id = users.user_id
        WHERE posts.post_id = $1
        `, [id])
        return rows[0]
    } catch (error) {
        console.log(error.message)
    }
}

const getCommentsByPostId = async (id) => {
    try {
        const { rows } = await pool.query(`SELECT  comments.comment_id,
        comments.comment_content,
        comments.created_at,
        users.user_name,
        users.user_id FROM comments JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = $1 ORDER BY comments.created_at DESC`, [id])
        return rows
    } catch (error) {
        console.log(error.message)
    }
}

const addNewComment = async (postId, comment, userId) => {
    try {
        await pool.query(`INSERT INTO comments(post_id,comment_content,user_id) VALUES ($1,$2,$3)`, [postId, comment, userId])
        await pool.query(
            "UPDATE posts SET comments_count = comments_count + 1 WHERE post_id = $1",
            [postId]
        );

    } catch (error) {
        console.log(error.message)
    }
}

const getAllUsersThatMatchesSearch = async (searchTerm) => {
    try {
        const { rows } = await pool.query(
            `SELECT user_id, user_name FROM users WHERE LOWER(user_name) LIKE $1`,
            [`%${searchTerm}%`]
        );
        return rows;
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { addUserToDb, getUserFromDb, savePostInDb, getAllPosts, updateUserProfile, updateLike, getPostDataById, getCommentsByPostId, addNewComment, getAllUsersThatMatchesSearch }