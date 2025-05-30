const express = require('express')

const router = express.Router()
const SavedArticleController = require('../controllers/SavedArticleController.js')

// Place your user routes here
router.post('/', SavedArticleController.createSavedArticle)
router.delete('/', SavedArticleController.deleteSavedArticleByUUID)
router.get('/by/:articleUUID/:userUUID', SavedArticleController.findSavedArticle)
router.get('/count', SavedArticleController.findSavedArticlesCountByArticleUUID)



module.exports = router
