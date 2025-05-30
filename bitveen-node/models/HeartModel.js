const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose

const HeartSchema = new Schema(
  {
    uuid: { type: String, default: uuid.v4, required: true },
    userUUID: { type: String, required: true },
    articleUUID: { type: String, required: true },
    heartCount: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'heartCount', minimize: false, timestamps: true },
)
HeartSchema.plugin(uniqueValidator)
module.exports = mongoose.model('heartCount', HeartSchema)