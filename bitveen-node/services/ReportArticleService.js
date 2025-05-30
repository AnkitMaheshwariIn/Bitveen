const reportArticleModel = require('../models/ReportArticleModel');

class ReportArticleService {
    constructor() { }

    create = async (data) => {
        try {
            console.log('Data for reportArticle create', data);
            return await reportArticleModel.insertMany([data], { runValidators: true })
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    //count
    findReportArticleCountById = async (query) => {
        try {
            console.log('Get reportArticle, Data By: ' + JSON.stringify(query))
            return await reportArticleModel.countDocuments(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findReportArticleById = async (query) => {
        try {
            console.log('Get reportArticle, Data By: ' + JSON.stringify(query))
            return await reportArticleModel.find(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    update =  async (uuid, data, session) => {
        try {
          console.log('Update reportArticle, Data: ' + JSON.stringify(data))
          // find and update record in mongoDB
          return await reportArticleModel.findOneAndUpdate({ uuid: uuid }, { $set: data }, { new: true, context: 'query', runValidators: true  })
        } catch (error) {
            console.log(error)
          throw new Error(error);
        }
      }

      deleteReportArticle = async (uuid) => {
        try {
          console.log('Delete ReportArticle by UUID, Data: ' + JSON.stringify(uuid))
          
          // find and delete record in mongoDB
          return await reportArticleModel.deleteOne({ uuid: uuid })
        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      }
}

module.exports = new ReportArticleService()