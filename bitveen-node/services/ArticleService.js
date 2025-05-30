const articleModel = require('../models/ArticleModel');

class ArticleService {
    constructor() { }

    create = async (data) => {
        try {
            console.log('Data for article create', data);
            data.articleLink = data.articleLink.replace(/[^0-9A-Za-z-]/g, '');
            return await articleModel.insertMany([data], { runValidators: true })
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findByLink = async (query) => {
      try {
          console.log('Get article, Data By: ' + JSON.stringify(query))
          return await articleModel.findOne(query)
      } catch (error) {
          console.log(error)
          throw new Error(error);
      }
    }

    findAll = async (query) => {
        try {
            console.log('Get article, Data By: ' + JSON.stringify(query))
            return await articleModel.find(query).sort({createdAt: -1})
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    aggregation = async (pipeline) => {
      try {
          console.log('Get article, Data By: ' + JSON.stringify(pipeline))
          return await articleModel.aggregate(pipeline)
      } catch (error) {
          console.log(error)
          throw new Error(error);
      }
    }

    findArticleById = async (query, options = {}) => {
        try {
            console.log('Get article, Data By: ' + JSON.stringify(query))
            return await articleModel.find(query, options).lean();
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    update =  async (articleUUID, data, session) => {
        try {
          console.log('Update article, Data: ' + JSON.stringify(data))
          // find and update record in mongoDB
          return await articleModel.findOneAndUpdate({ uuid: articleUUID }, { $set: data }, { new: true, context: 'query', runValidators: true  })
        } catch (error) {
            console.log(error)
          throw new Error(error);
        }
      }

      deleteArticle = async (uuid, req) => {
        try {
          console.log('Delete Article by UUID, Data: ' + JSON.stringify(uuid))
          
          // find and delete record in mongoDB
          return await articleModel.deleteOne({ uuid: uuid })
        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      }
}

module.exports = new ArticleService()