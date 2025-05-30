const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose

const savedArticleSchema = new Schema(
  {
    uuid: { type: String, default: uuid.v4, required: true },
    userUUID: { type: String, required: true },
    articleUserUUID: { type: String, required: true },
    articleUUID : { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'savedArticle', minimize: false, timestamps: true },
)

savedArticleSchema.plugin(uniqueValidator)

module.exports = mongoose.model('savedArticle', savedArticleSchema)