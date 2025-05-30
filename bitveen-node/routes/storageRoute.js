const express = require('express')
const router = express.Router()
const storeController = require('../controllers/StorageController')
var multer = require('multer');
const upload = multer({dest:'BITVEEN/Article/Images'});

// Place your user routes here
router.post('/uploadFile', upload.single('file'), storeController.uploadFileS3)
// NO NEED OF GET API UPLOAD ITSELF RETURNS URL
// router.get('/',  storeController.getFile)

module.exports = router
