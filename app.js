if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const { connectDB } = require('./utils/database')
const { Liquid } = require('liquidjs')
const expressSession = require('express-session')
const connectFlash = require('connect-flash')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const { ensureLoggedIn } = require('connect-ensure-login')
const userRouter = require('./routers/user.route')
const authRouter = require('./routers/auth.route')
const {
    notFoundHandler,
    internalError
} = require('./middlewares/error-handler')
const setLocals = require('./middlewares/setLocals')
const ensureAdmin = require('./middlewares/ensureAdmin')
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
        },
        store: MongoStore.create({ mongoUrl: process.env.DB_URL })
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(connectFlash())
require('./utils/passport.auth')
app.use(setLocals)

app.use('/auth', authRouter)
app.use('/user', ensureLoggedIn('/auth/login'), userRouter)
app.use('/admin', ensureAdmin('/'), userRouter)
app.get('/', (req, res) => {
    res.render('home')
})
app.use(notFoundHandler)
app.use(internalError)

app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`))
