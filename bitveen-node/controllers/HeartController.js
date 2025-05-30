const HeartService = require('../services/HeartService.js');
const { v4: uuidv4 } = require('uuid');
const ArticleService = require('../services/ArticleService.js');

class Heart {
    constructor() { }

    // for article writer/owner
    findHeartsByArticleUUID = async (req, res, next) => {
        try {
            console.log('Find Heart, Data By: ' + JSON.stringify(req.params))
            if (!req.params.articleUUID) throw new Error("Article uuid is required.");
            let query = { articleUUID: req.params.articleUUID };
            // call method to service
            let result = await HeartService.findHeartsByQuery(query);

            if (!result) {
                return res.status(404).send('no heart found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    findArticleHeartCount = async (req, res, next) => {
        try {
            console.log('Find Heart, Data By: ' + JSON.stringify(req.body))
            if (!req.body.articleUUID) throw new Error("Article uuid is required.");
            let query = { articleUUID: req.body.articleUUID };
            // call method to service
            let pipeline = [
                {
                    $match: {
                        ...query
                    }
                },
                {
                    $group: {
                        _id: '',
                        "heartCount": { $sum: '$heartCount' }
                    }
                }, {
                    $project: {
                        _id: 0,
                        "TotalHeartCount": '$heartCount'
                    }
                }
            ]
            let result = await HeartService.findHeartsByAgg(pipeline);

            if (!result || !result[0]) {
                return res.status(404).send('no heart found in the database')
            }
            return res.status(200).send(result[0]);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    putHeart = async (req, res, next) => {
        try {

            console.log('Create Heart, Data By: ' + JSON.stringify(req.body))
            let data = req.body;
            data.uuid = uuidv4(); // unique id for article
            //check if article exist
            const article = await ArticleService.findArticleById({ uuid: data.articleUUID }, { _id: 0, uuid: 1 });
            if (!article || article.length == 0) throw new Error("Article not found")
            // call method to service
            let resp = await HeartService.put(data);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    updateHeart = async (req, res) => {
        try {
            if (Object.keys(req.body).length === 0) {
                return apiResponse.notFoundResponse(res, `No article data found for update`);
            }
            if (!req.params.articleUUID) return apiResponse.errorResponse(res, "Please send articleUUID");

            const data = req.body
            data.updatedAt = new Date()
            let articleUUID = req.params.articleUUID
            // call method to service
            let resp = await HeartService.update(articleUUID, data);
            if (resp) {
                return res.status(200).send(resp)
            } else {
                return res.status(400).send(`No article found for the articleUUID provided:${articleUUID}`);
            }
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
    }

    deleteHeartByUUID = async (req, res, next) => {
        try {
            console.log('Delete Heart, Data By: ' + JSON.stringify(req.body))
            //if (!req.body.uuid) throw new Error("Heart UUID is required.");
            if (!req.body.userUUID) throw new Error("userUUID is required.");
            if (!req.body.articleUUID) throw new Error("articleUUID is required.");
            let query = {}
            //query.uuid = req.body.uuid
            query.userUUID = req.body.userUUID
            query.articleUUID = req.body.articleUUID
            // call method to service
            let resp = await HeartService.deleteHeart(query);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }
}

module.exports = new Heart()