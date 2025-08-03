require('dotenv').config()
const express = require('express')
const cors = require('cors')

const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRoute)
app.use('/post', postRoute)

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`SERVER STARTED OVER PORT ${PORT}`))

module.exports = app;