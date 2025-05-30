const commentModel = require('../models/CommentModel');

class CommentService {
    constructor() { }

    create = async (data) => {
        try {
            console.log('Data for comment create', data);
            return await commentModel.insertMany([data], { runValidators: true })
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findAll = async (query) => {
        try {
            console.log('Get comment, Data By: ' + JSON.stringify(query))
            return await commentModel.find(query)
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findcommentById = async (query) => {
        try {
            console.log('Get comment, Data By: ' + JSON.stringify(query))
            return await commentModel.find(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    update =  async (commentUUID, data, session) => {
        try {
          console.log('Update comment, Data: ' + JSON.stringify(data))
          // find and update record in mongoDB
          return await commentModel.findOneAndUpdate({ uuid: commentUUID }, { $set: data }, { new: true, context: 'query', runValidators: true  })
        } catch (error) {
            console.log(error)
          throw new Error(error);
        }
      }

      deleteComment = async (uuid, req) => {
        try {
          console.log('Delete comment by UUID, Data: ' + JSON.stringify(uuid))
          
          // find and delete record in mongoDB
          return await commentModel.deleteOne({ uuid: uuid })
        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      }
}

module.exports = new CommentService()