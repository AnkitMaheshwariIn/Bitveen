const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose

const ReplySchema = new Schema(
  {
    uuid: { type: String, default: uuid.v4, required: true },
    userUUID: { type: String, required: true },
    articleUUID: { type: String, required: true },
    commentUUID: { type: String, required: true },
    text: { type: String, required: true },
    isEdited : { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'reply', minimize: false, timestamps: true },
)
ReplySchema.plugin(uniqueValidator)
module.exports = mongoose.model('reply', ReplySchema)