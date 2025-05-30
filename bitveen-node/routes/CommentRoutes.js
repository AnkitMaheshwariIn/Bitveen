const express = require('express')

const router = express.Router()
const CommentController = require('../controllers/CommentController.js')

// Place your user routes here
router.post('/', CommentController.createComment)
router.get('/by', CommentController.findCommentBy)
router.patch('/:commentUUID', CommentController.updateComment)
router.delete('/:uuid', CommentController.deleteCommentByUUId)

module.exports = router
