const { body } = require('express-validator')
const UserModel = require('../model/User.model')

module.exports = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Please provide an email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .custom(async (email) => {
            const doesExist = await UserModel.findOne({ email })
            if (doesExist) {
                throw Error('Email is already in use')
            }
            return true
        }),
    body('password')
        .notEmpty()
        .withMessage('Please provide a password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .isLength({ max: 20 })
        .withMessage('Password must be lower than 20 characters'),
    body('confirm-password')
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (req.body.password !== value) {
                throw Error("Confirmation password doesn't match with password")
            }
            return true
        }),
    body('terms')
        .equals('on')
        .withMessage('Please confirm our terms and conditions')
]
