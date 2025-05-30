const CommentService = require('../services/CommentService.js');
const {v4: uuidv4} = require('uuid');
const UserService = require('../services/UserService.js');
const UserModel = require('../models/UserModel.js');

class Comment {
    constructor() { }

    // By Comment UUID
    findCommentBy = async (req, res, next) => {
        try {
            console.log('Find Comment, Data By: ' + JSON.stringify(req.query))
            if (!req.query.articleUUID) throw new Error("articleUUID is required.");
            let query = {}
            query.articleUUID = req.query.articleUUID
            // call method to service
            let result = await CommentService.findcommentById(query);

            if (!result) {
                return res.status(404).send('comment not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    
    
    createComment = async (req, res, next) => {
        try {

            console.log('Create Comment, Data By: ' + JSON.stringify(req.body))
            let data = req.body;
            data.uuid = uuidv4(); // unique id for comment

            // call method to service
            let resp = await CommentService.create(data);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    updateComment = async (req, res) => {
        try {
          if (Object.keys(req.body).length === 0) {
            return apiResponse.notFoundResponse(res, `No comment data found for update`);
          }
          if (!req.params.commentUUID) return apiResponse.errorResponse(res, "Please send commentUUID");
    
          const data = req.body
          data.isEdited = true
          data.updatedAt = new Date()
          let commentUUID = req.params.commentUUID
          // call method to service
          let resp = await CommentService.update(commentUUID, data);
          if (resp) {
            return  res.status(200).send(resp)
          } else {
            return res.status(400).send(`No comment found for the commentUUID provided:${commentUUID}`);
          }
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
    }

    deleteCommentByUUId = async (req, res, next) =>{
        try {
            console.log('Delete Comment, Data By: ' + JSON.stringify(req.body))
            if (!req.params.uuid) throw new Error("Comment UUID is required.");
            let uuid = req.params.uuid;
            // call method to service
            let resp = await CommentService.deleteComment(uuid, req);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }
}

module.exports = new Comment()