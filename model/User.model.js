const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const { roles } = require('../utils/roles')
const createHttpError = require('http-errors')

const userSchema = new Schema(
    {
        googleId: {
            type: String,
            unique: true
        },
        username: {
            type: String,
            minlength: 4,
            maxlength: 12,
            required: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            minlength: 8,
            maxlength: 20
        },
        avatar: {
            type: String
        },
        role: {
            type: String,
            enum: [roles.admin, roles.moderator, roles.viewer],
            default: roles.viewer
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    try {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10)
        }
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isMatchPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw createHttpError.InternalServerError(error.message)
    }
}

module.exports = model('user', userSchema)
