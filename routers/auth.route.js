const authRouter = require('express').Router()

userRouter.get('/', (req, res) => {
    res.send('hello world')
})

module.exports = authRouter
