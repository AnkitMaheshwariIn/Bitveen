const express = require('express')

const router = express.Router()
const ReportArticleController = require('../controllers/ReportArticleController.js')

// Place your user routes here
router.post('/', ReportArticleController.createReportArticle)
router.delete('/', ReportArticleController.deleteReportArticleByUUID)
router.get('/by', ReportArticleController.findReportArticlesByArticleUUID)
router.get('/count', ReportArticleController.findReportArticlesCountByArticleUUID)
router.patch('/', ReportArticleController.updateReportArticle)


module.exports = router
