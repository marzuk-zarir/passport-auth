const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const UserModel = require('../model/User.model')

// Local authentication
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email })
                if (!user) {
                    return done(null, false)
                }
                return (await user.isMatchPassword(password))
                    ? done(null, user)
                    : done(null, false)
            } catch (error) {
                done(error)
            }
        }
    )
)

// Google Oauth
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: '/auth/oauth/google/redirect'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await UserModel.findOne({
                    googleId: profile.id
                })
                if (!existingUser) {
                    const { sub, name, email, picture } = profile._json
                    const newUser = new UserModel({
                        googleId: sub,
                        username: name,
                        email,
                        avatar: picture
                    })
                    newUser.save()
                    done(null, newUser)
                }
                done(null, existingUser)
            } catch (error) {
                done(error)
            }
        }
    )
)

// Facebook Oauth
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
            callbackURL: '/auth/oauth/facebook/redirect'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})
