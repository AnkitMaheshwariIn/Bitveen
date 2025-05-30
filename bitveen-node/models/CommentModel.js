const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose

const CommentSchema = new Schema(
  {
    uuid: { type: String, default: uuid.v4, required: true },
    userUUID: { type: String, required: true },
    articleUUID: { type: String, required: true },
    text: { type: String },
    replyCount : { type: Number },
    isEdited : { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'comment', minimize: false, timestamps: true },
)
CommentSchema.plugin(uniqueValidator)
module.exports = mongoose.model('comment', CommentSchema)