const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose

const ReportArticleSchema = new Schema(
  {
    uuid: { type: String, default: uuid.v4, required: true },
    userUUID: { type: String, required: true },
    articleUUID: { type: String, required: true },
    text: { type: String },
    reportType: { type: String, required: true, enum:['SPAN', 'HARASMENT', 'RULES VIOLATION'] },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'reportArticle', minimize: false, timestamps: true },
)
ReportArticleSchema.plugin(uniqueValidator)
module.exports = mongoose.model('reportArticle', ReportArticleSchema)