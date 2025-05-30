const SavedArticleModel = require('../models/SavedArticleModel');

class SavedArticleService {
    constructor() { }

    create = async (data) => {
        try {
            console.log('Data for SavedArticle create', data);
            return await SavedArticleModel.insertMany([data], { runValidators: true })
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    //count
    findSavedArticleCountById = async (query) => {
        try {
            console.log('Get SavedArticle, Data By: ' + JSON.stringify(query))
            return await SavedArticleModel.countDocuments(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findSavedArticleById = async (query) => {
        try {
            console.log('Get SavedArticle, Data By: ' + JSON.stringify(query))
            return await SavedArticleModel.find(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    deleteSavedArticle = async (query) => {
      try {
        console.log('Delete SavedArticle by query, Data: ' + JSON.stringify(query))
        
        // find and delete record in mongoDB
        return await SavedArticleModel.deleteOne(query)
      } catch (error) {
        console.log(error)
        throw new Error(error);
      }
    }
}

module.exports = new SavedArticleService()