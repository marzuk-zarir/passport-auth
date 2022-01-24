const authRouter = require('express').Router()
const passport = require('passport')
const { validationResult } = require('express-validator')
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login')
const UserModel = require('../model/User.model')
const signupSchema = require('../schema/signup.schema')

// Local signup
authRouter
    .route('/signup')
    .all(ensureLoggedOut('/user/profile'))
    .get((req, res) => {
        res.render('signup', { values: {}, errors: {} })
    })
    .post(signupSchema, async (req, res, next) => {
        const { username, email, password, terms } = req.body
        const errors = validationResult(req).formatWith(({ msg }) => msg)
        if (!errors.isEmpty()) {
            return res.render('signup', {
                values: { username, email, password, terms },
                errors: errors.mapped()
            })
        }
        try {
            const newUser = new UserModel({ username, email, password })
            await newUser.save()
            req.flash('success', 'Account created successfully')
            res.redirect('/auth/login')
        } catch (error) {
            next(error)
        }
    })

// Local login
authRouter
    .route('/login')
    .all(ensureLoggedOut('/user/profile'))
    .get((req, res) => {
        res.render('login', { values: {} })
    })
    .post(
        passport.authenticate('local', {
            successReturnToOrRedirect: '/user/profile',
            failureRedirect: '/auth/login',
            failureFlash: 'Invalid Email/Password field'
        })
    )

// Google oauth
authRouter.get(
    '/oauth/google',
    ensureLoggedOut('/user/profile'),
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

authRouter.get(
    '/oauth/google/redirect',
    ensureLoggedOut('/user/profile'),
    passport.authenticate('google', {
        successReturnToOrRedirect: '/user/profile'
    })
)

// Facebook oauth
authRouter.get(
    '/oauth/facebook',
    ensureLoggedOut('/user/profile'),
    passport.authenticate('facebook')
)

authRouter.get(
    '/oauth/facebook/redirect',
    ensureLoggedOut('/user/profile'),
    passport.authenticate('facebook', {
        successReturnToOrRedirect: '/user/profile',
        failureRedirect: '/auth/login'
    })
)

// Twitter oauth
authRouter.get('/oauth/twitter')

authRouter.get('/oauth/twitter/redirect')

// Logout
authRouter.get('/logout', ensureLoggedIn('/auth/login'), (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = authRouter
