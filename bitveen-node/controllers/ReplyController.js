const ReplyService = require('../services/ReplyService.js');
const {v4: uuidv4} = require('uuid');
const UserModel = require('../models/UserModel.js');

class Reply {
    constructor() { }

    // By Reply UUID
    findReplyBy = async (req, res, next) => {
        try {
            console.log('Find Reply, Data By: ' + JSON.stringify(req.query))
            if (!req.query.uuid) throw new Error("Reply id is required.");
            let query = { uuid: req.query.uuid, isActive: true };
            // call method to service
            let result = await ReplyService.findReplyById(query);

            if (!result) {
                return res.status(404).send('reply not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    // By commentUUID get replys
    findAllReplyBy = async (req, res, next) => {
        try {
            console.log('Find Reply, Data By: ' + JSON.stringify(req.params))
            let query = {};
            if (req.query.commentUUID && req.query.articleUUID) {
                query.commentUUID = req.query.commentUUID
                query.articleUUID = req.query.articleUUID
            } else {
                throw new Error("commentUUID & articleUUID is required.");
            }

            // call method to service
            let result = await ReplyService.findAll(query);

            if (!result) {
                return res.status(404).send('reply not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    // By login userUUID and remove blocked users reply, if blocked.
    findAll = async (req, res, next) => {
        try {
            console.log('Find Reply, Data By: ' + JSON.stringify(req.params))
            let query = { isActive: true };
            if (!req.query.userUUID) throw new Error("User id is required.");
            // check if user have blockedUsers List, Remove that Blocked users Reply
            const loginUser = await UserService.findUserByQuery({uuid: req.query.userUUID }, {blockedUsers:1, uuid:1})
            if(loginUser?.blockedUsers){
                { query.userUUID = {$nin : loginUser.blockedUsers}}
            }
            
            // call method to service
            let result = await ReplyService.findAll(query);

            if (!result) {
                return res.status(404).send('reply not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    createReply = async (req, res, next) => {
        try {

            console.log('Create Reply, Data By: ' + JSON.stringify(req.body))
            let data = req.body;
            data.uuid = uuidv4(); // unique id for reply

            // call method to service
            let resp = await ReplyService.create(data);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    updateReply = async (req, res) => {
        try {
          if (Object.keys(req.body).length === 0) {
            return apiResponse.notFoundResponse(res, `No reply data found for update`);
          }
          if (!req.params.replyUUID) return apiResponse.errorResponse(res, "Please send replyUUID");
    
          const data = req.body
          data.isEdited = true
          data.updatedAt = new Date()
          let replyUUID = req.params.replyUUID
          // call method to service
          let resp = await ReplyService.update(replyUUID, data);
          if (resp) {
            return  res.status(200).send(resp)
          } else {
            return res.status(400).send(`No reply found for the replyUUID provided:${replyUUID}`);
          }
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
    }

    deleteReplyByUUId = async (req, res, next) =>{
        try {
            console.log('Delete Reply, Data By: ' + JSON.stringify(req.body))
            if (!req.params.uuid) throw new Error("Reply UUID is required.");
            if (!req.body.commentUUID) throw new Error("commentUUID is required.");
            const uuid = req.params.uuid;
            const commentUUID = req.body.commentUUID;
            // call method to service
            let resp = await ReplyService.deleteReply(uuid, commentUUID);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }
}

module.exports = new Reply()