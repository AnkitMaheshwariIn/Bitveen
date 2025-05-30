const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose

const articleSchema = new Schema(
  {
    uuid: { type: String, default: uuid.v4, required: true },
    userUUID: { type: String, required: true },
    blocks: { type: Array, required: true },
    title: { type: String, required: true },
    /**
     * topics is an array, which stores category, sub-category and more values for an story.
     * A story can have one, two or even more topics to categorize story.
     * For client: Select your topic of story comes under which categories!
     */
    topics: [{
      type: String,
      required: true 
    }],
    /**
     * pageAccess will keep the list of page names where these articles can be display
     * example: home, highlights, staff-picks etc.
     */
    pageAccess: [{
      type: String,
      required: false 
    }],
    headerImage : { type: String }, 
    subTitle: { type: String, required: true },
    version: { type: String, required: true },
    isPublished: { type: Boolean , default: false}, 
    articleLink: { type: String, required: true, unique: true },
    isActive: { type: Boolean , default: true},
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { collection: 'article', minimize: false, timestamps: true },
)

articleSchema.plugin(uniqueValidator)

module.exports = mongoose.model('article', articleSchema)