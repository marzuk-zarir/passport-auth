if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const { connectDB } = require('./utils/database')
const { Liquid } = require('liquidjs')
const expressSession = require('express-session')
const userRouter = require('./routers/user.route')
const authRouter = require('./routers/auth.route')
const {
    notFoundHandler,
    internalError
} = require('./middlewares/error-handler')
const app = express()
const PORT = process.env.PORT || 3000
const liquid = new Liquid({ layouts: './views/layouts' })

connectDB()

app.engine('liquid', liquid.express())
app.set('view engine', 'liquid')
app.set('views', './views')
app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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
app.use('/admin', userRouter)
app.get('/', (req, res) => {
    res.render('home')
})
app.use(notFoundHandler)
app.use(internalError)

app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`))
