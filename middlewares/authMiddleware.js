const dotenv = require('dotenv')
dotenv.config()
const jwt = require("jsonwebtoken")
const db = require('../db/queries')

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return res.json({ msg: 'Access denied as no token found!' })
    }
    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET_KEY)

        const user = await db.getUserFromDb(decoded.userMail)
        if (user.length != 0) {
            req.user_id = decoded.userId
            req.user_mail = decoded.userMail
            next()
        }
        else {
            return res.json({ status: 404, msg: 'User not found!' })
        }
    } catch (error) {
        console.log(error.message)
        return res.json({ status: 500, msg: error.message })
    }

}

module.exports = verifyToken