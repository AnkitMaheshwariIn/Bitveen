const express = require('express')

const router = express.Router()
const HeartController = require('../controllers/HeartController.js')

// Place your user routes here
router.put('/', HeartController.putHeart)
// router.delete('/', HeartController.deleteHeartByUUID)
router.get('/by/:articleUUID', HeartController.findHeartsByArticleUUID)
router.get('/count', HeartController.findArticleHeartCount)


module.exports = router
