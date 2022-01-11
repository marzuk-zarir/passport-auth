const userRouter = require('express').Router()

userRouter.get('/', (req, res) => {
    res.send('hello world')
})

module.exports = userRouter
