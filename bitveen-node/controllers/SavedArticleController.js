const SavedArticleService = require('../services/SavedArticleService.js');
const {v4: uuidv4} = require('uuid');
const apiResponse = require("../helper/apiResponse");

class SavedArticle {
    constructor() { }

    findSavedArticle = async (req, res, next) => {
        try {
            console.log('Find SavedArticle, Data By: ' + JSON.stringify(req.params))
            if (!req.params.articleUUID) throw new Error("articleUUID is required.");
            if (!req.params.userUUID) throw new Error("userUUID is required.");
            let query = { articleUUID: req.params.articleUUID, userUUID: req.params.userUUID };
            // call method to service
            let result = await SavedArticleService.findSavedArticleById(query);

            if (result[0] && result[0].uuid) {
                return apiResponse.successResponse(res, `Article saved`);
            }
            return apiResponse.successResponseNotFound(res, 'Article not saved')
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    findSavedArticlesCountByArticleUUID = async (req, res, next) => {
        try {
            console.log('Find SavedArticle, Data By: ' + JSON.stringify(req.body))
            if (!req.body.articleUUID) throw new Error("articleUUID is required.");
            let query = { articleUUID: req.body.articleUUID };
            // call method to service
            let result = await SavedArticleService.findSavedArticleCountById(query);

            if (!result) {
                return res.status(404).send('Saved not found in the database')
            }
            return res.status(200).send({totelSavedCount : result});
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    createSavedArticle = async (req, res, next) => {
        try {

            console.log('Create SavedArticle, Data By: ' + JSON.stringify(req.body))
            let data = req.body;
            data.uuid = uuidv4(); // unique id for article

            // call method to service
            let resp = await SavedArticleService.create(data);
            if (resp[0].uuid) {
                return apiResponse.successResponse(res, `Sucessfully saved`);
            }
            return apiResponse.errorResponse(res, 'Failed to save')
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    deleteSavedArticleByUUID = async (req, res, next) =>{
        try {
            console.log('Delete SavedArticle, Data By: ' + JSON.stringify(req.body))
            if (!req.body.articleUUID) throw new Error("articleUUID is required.");
            if (!req.body.userUUID) throw new Error("userUUID is required.");
            const articleUUID = req.body.articleUUID;
            const userUUID = req.body.userUUID;
            // call method to service
            const resp = await SavedArticleService.deleteSavedArticle({userUUID, articleUUID});

            if (resp.acknowledged && resp.deletedCount) {
                return apiResponse.successResponse(res, `Sucessfully removed from save`);
            }
            return apiResponse.errorResponse(res, 'Failed to remove from')
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }
}

module.exports = new SavedArticle()