const express = require('express')

const router = express.Router()
const ReplyController = require('../controllers/ReplyController.js')

// Place your user routes here
router.post('/', ReplyController.createReply)
router.get('/by', ReplyController.findAllReplyBy) //commentUUID & articleUUID
router.patch('/:replyUUID', ReplyController.updateReply)
router.delete('/:uuid', ReplyController.deleteReplyByUUId)

module.exports = router
