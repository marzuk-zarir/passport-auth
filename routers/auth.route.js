const { validationResult } = require('express-validator')
const UserModel = require('../model/User.model')
const signupSchema = require('../schema/signup.schema')

const authRouter = require('express').Router()

authRouter.get('/signup', (req, res) => {
    res.render('signup', {
        values: {},
        errors: {}
    })
})
authRouter.post('/signup', signupSchema, async (req, res, next) => {
    const { email, password, terms } = req.body
    const errors = validationResult(req).formatWith(({ msg }) => msg)
    if (!errors.isEmpty()) {
        return res.render('signup', {
            values: { email, password, terms },
            errors: errors.mapped()
        })
    }
    try {
        const newUser = new UserModel({ email, password })
        await newUser.save()
        res.redirect('/user/profile')
    } catch (error) {
        next(error)
    }
})

authRouter.get('/login', (req, res) => {
    res.render('login')
})

module.exports = authRouter

// save
// W3nAuM5JGC/7H0rE0biWt.hNV0CY7XXZKTXRXu7l3we00cvO1LpiO
