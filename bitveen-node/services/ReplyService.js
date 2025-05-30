const CommentModel = require('../models/CommentModel');
const replyModel = require('../models/ReplyModel');

class ReplyService {
    constructor() { }

    create = async (data) => {
        try {
            console.log('Data for reply create', data);
            // add count in comment collection
            await CommentModel.updateOne(
                { uuid: data.commentUUID },
                { $inc: { replyCount: 1 } }
             )
            return await replyModel.insertMany([data], { runValidators: true })
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findAll = async (query) => {
        try {
            console.log('Get reply, Data By: ' + JSON.stringify(query))
            return await replyModel.find(query)
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findreplyById = async (query) => {
        try {
            console.log('Get reply, Data By: ' + JSON.stringify(query))
            return await replyModel.find(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    update =  async (replyUUID, data, session) => {
        try {
          console.log('Update reply, Data: ' + JSON.stringify(data))
          // find and update record in mongoDB
          return await replyModel.findOneAndUpdate({ uuid: replyUUID }, { $set: data }, { new: true, context: 'query', runValidators: true  })
        } catch (error) {
            console.log(error)
          throw new Error(error);
        }
      }

      deleteReply = async (uuid, commentUUID) => {
        try {
          console.log('Delete reply by UUID, Data: ' + JSON.stringify(uuid))
          // remove count in comment collection
          await CommentModel.updateOne(
            { uuid: commentUUID },
            { $inc: { replyCount: -1 } }
          )
          // find and delete record in mongoDB
          return await replyModel.deleteOne({ uuid: uuid })
        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      }
}

module.exports = new ReplyService()