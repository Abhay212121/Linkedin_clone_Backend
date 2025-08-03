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

module.exports = { addUserToDb, getUserFromDb, savePostInDb, getAllPosts, updateUserProfile, updateLike }