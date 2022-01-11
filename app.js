if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const expressSession = require('express-session')
const authRouter = require('./routers/auth.route')
const userRouter = require('./routers/user.route')
const { connectDB } = require('./utils/database')
const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.set('view engine', 'pug')
app.set('trust proxy', true)
app.use(
    expressSession({
        secret: 'secret key',
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            httpOnly: true,
            maxAge: 86600000
        }
    })
)

app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`))
