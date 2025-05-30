const ReportArticleService = require('../services/ReportArticleService.js');
const {v4: uuidv4} = require('uuid');

class ReportArticle {
    constructor() { }

    findReportArticlesByArticleUUID = async (req, res, next) => {
        try {
            console.log('Find ReportArticle, Data By: ' + JSON.stringify(req.body))
            if (!req.body.articleUUID) throw new Error("articleUUID is required.");
            let query = { articleUUID: req.body.articleUUID };
            // call method to service
            let result = await ReportArticleService.findReportArticleById(query);

            if (!result) {
                return res.status(404).send('article not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    findReportArticlesCountByArticleUUID = async (req, res, next) => {
        try {
            console.log('Find ReportArticle, Data By: ' + JSON.stringify(req.body))
            if (!req.body.articleUUID) throw new Error("articleUUID is required.");
            let query = { articleUUID: req.body.articleUUID };
            // call method to service
            let result = await ReportArticleService.findReportArticleCountById(query);

            if (!result) {
                return res.status(404).send('report not found in the database')
            }
            return res.status(200).send({totelReportCount : result});
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    createReportArticle = async (req, res, next) => {
        try {

            console.log('Create ReportArticle, Data By: ' + JSON.stringify(req.body))
            let data = req.body;
            data.uuid = uuidv4(); // unique id for article

            // call method to service
            let resp = await ReportArticleService.create(data);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    updateReportArticle = async (req, res) => {
        try {
          if (Object.keys(req.body).length === 0) {
            return apiResponse.notFoundResponse(res, `No article data found for update`);
          }
          if (!req.body.uuid) return apiResponse.errorResponse(res, "Please send reportArticle UUID");
    
          const data = req.body
          data.updatedAt = new Date()
          let uuid = req.body.uuid
          // call method to service
          let resp = await ReportArticleService.update(uuid, data);
          if (resp) {
            return  res.status(200).send(resp)
          } else {
            return res.status(400).send(`No Report found for the uuid provided:${uuid}`);
          }
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
    }

    deleteReportArticleByUUID = async (req, res, next) =>{
        try {
            console.log('Delete ReportArticle, Data By: ' + JSON.stringify(req.body))
            if (!req.params.uuid) throw new Error("ReportArticle UUID is required.");
            let uuid = req.params.uuid;
            // call method to service
            let resp = await ReportArticleService.deleteReportArticle(uuid);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }
}

module.exports = new ReportArticle()