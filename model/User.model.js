const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const { roles } = require('../utils/roles')

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            minlength: 8,
            maxlength: 20,
            required: true
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
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = model('user', userSchema)
