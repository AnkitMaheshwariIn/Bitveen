const express = require('express')

const router = express.Router()
const ArticleController = require('../controllers/ArticleController.js')

// Place your user routes here
router.post('/', ArticleController.createArticle)
router.get('/', ArticleController.findAllBy) // get all article of userUUID or by username or articleLink
router.get('/all', ArticleController.findAll) // remove blocked users article
router.patch('/:articleUUID', ArticleController.updateArticle)
router.delete('/:uuid', ArticleController.deleteArticleByUUId)

module.exports = router
