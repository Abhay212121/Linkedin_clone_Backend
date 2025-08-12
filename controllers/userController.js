require('dotenv').config()
const { body, validationResult } = require("express-validator")
const db = require('../db/queries')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userNameRegex = /^(?!\s*$)[A-Za-z0-9 ]+$/;


const validateUserData = [
    body('name').trim().matches(userNameRegex).withMessage('Symbols not allowed'),
    body('email').isEmail().withMessage('Enter a valid email'),
]

const postUserToDb = [validateUserData, async (req, res) => {
    const errors = validationResult(req)
    const existingErrors = errors.array()
    const { name, email, password } = req.body

    try {
        const user = await db.getUserFromDb(email);

        //if there's a user with same userName
        if (user.length != 0) {
            existingErrors.push({ path: 'email', msg: 'Email already in use' })
        }

        //if there are errors
        if (existingErrors.length > 0) {
            return res.json({ status: 400, msg: 'validation errors found!', errors: existingErrors })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 8)
        await db.addUserToDb(name, email, hashedPassword)
        return res.json({ status: 200, msg: 'User registered to db!' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}]

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        //check if usermail exists or not in db.
        const user = await db.getUserFromDb(email);
        if (user.length == 0) {
            return res.json({ status: 400, errors: [{ path: 'email', msg: 'User not found!' }] })
        }
        //check if the password matches.
        const match = await bcrypt.compare(password, user[0].user_password)
        if (!match) {
            return res.json({ status: 400, errors: [{ path: 'password', msg: 'Wrong password!' }] })
        }

        //data to store in the token.
        const payload = {
            userId: user[0].user_id,
            userMail: user[0].user_mail
        }

        const token = jwt.sign(payload, process.env.MY_SECRET_KEY, { expiresIn: '30d' });
        return res.json({ status: 200, msg: 'User logged in!', token: token, userName: user[0].user_name, userId: user[0].user_id, userJob: user[0].user_jobrole })
    } catch (error) {
        return res.send({ status: 500, msg: 'Internal Server Error!' })
    }
}

const updateProfile = async (req, res) => {
    const email = req.user_mail;
    const job = req.body.job?.trim();
    const org = req.body.org?.trim();
    const location = req.body.location?.trim();
    const about = req.body.about?.trim();

    let skills = req.body.skills || "";
    skills = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const result = `${job} at ${org}`;

    try {
        await db.updateUserProfile(result, email, location, about, skills);
        return res.json({
            status: 200,
            msg: "Profile updated.",
            job: result,
        });
    } catch (error) {
        return res.json({
            status: 500,
            msg: error.message,
        });
    }
};


const getAllUsers = async (req, res) => {
    let searchTerm = req.body.searchTerm
    searchTerm = searchTerm.toLowerCase()
    try {
        const result = await db.getAllUsersThatMatchesSearch(searchTerm)
        return res.json({ status: 200, userData: result })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const getUserProfile = async (req, res) => {
    const userId = req.query.userIdNum
    try {
        const userData = await db.getProfileDataFromDb(userId)
        return res.json({ status: 200, userData: userData[0] })
    } catch (error) {
        return res.json({ status: 500, error: error.message })
    }
}

module.exports = { postUserToDb, loginUser, updateProfile, getAllUsers, getUserProfile }