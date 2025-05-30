const express = require('express')

const router = express.Router()
const loginController = require('../controllers/LoginController')

// Place your user routes here
/* login with username and password - 
 * enable later when frontend implementation finished
**/
router.post('/', loginController.login)

/* login with Google */
router.post('/withGoogle', loginController.loginWithGoogle)

module.exports = router
