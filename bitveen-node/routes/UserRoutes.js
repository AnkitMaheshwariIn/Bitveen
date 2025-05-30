const express = require('express')

const router = express.Router()
const UserController = require('../controllers/UserController')

// Place your user routes here

// router.get('/', UserController.findAll)
// router.patch('/:userUUID', UserController.updateUser)

router.put('/follow', UserController.updateFollowers)

module.exports = router
