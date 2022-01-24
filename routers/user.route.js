const userRouter = require('express').Router()
const { query, validationResult } = require('express-validator')
const UserModel = require('../model/User.model')

userRouter.get('/profile', (req, res) => {
    res.render('profile')
})

userRouter.get(
    '/account/delete',
    query('id').isMongoId(),
    async (req, res, next) => {
        if (!validationResult(req).isEmpty()) {
            return res.redirect('/user/profile')
        }
        try {
            await UserModel.findByIdAndDelete(req.query.id)
            req.logOut()
            res.redirect('/')
        } catch (error) {
            next(error)
        }
    }
)

module.exports = userRouter
