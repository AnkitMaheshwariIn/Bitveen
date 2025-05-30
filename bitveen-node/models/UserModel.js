const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose

const userSchema = new Schema(
  {
    uuid: { type: String, default: uuid.v4, required: true },
    username: { type: String, required: true, unique: true },
    locale: { type: String, required: true, default: 'en'},
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: false },
    email: {
        type: String,
        index: true,
        match: /.+\@.+\..+/,
    },
    verifiedEmail: { type: Boolean , default: false},
    phoneNumber: { type: String, required: false },
    socialLogin: { type: String, required: false }, // Google, Facebook etc.
    socialLoginId: { type: String, required: false },
    verifiedPhoneNumber: { type: Boolean , default: false},
    blockedUsers: [{
      type: String
    }],
    userImage : {type: Object},
    followers : [{type: String}],
    following : [{type: String}],
    isActive: { type: Boolean , default: true},
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'user', minimize: false, timestamps: true },
)

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user', userSchema)