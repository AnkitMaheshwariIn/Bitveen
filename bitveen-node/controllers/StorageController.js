const StorageService = require("../services/StorageService");
const logger = require('../common/logging/services/logger').loggers.get('general')
const fs = require('fs');
// const UploadModel = require('../models/UploadModel')
const apiResponse = require("../helper/apiResponse");

class StorageController {
    constructor() { }

    /*
    getFile = async (req, res, next) => {
      logger.info('Get Attachment, Data By: ' + JSON.stringify(req.query))
      try {
        let query = {};
        if (req?.query?.uuid != undefined) {
          query.uuid = req?.query?.uuid
        } else {
          throw new Error("UUID not found")
        }
        query.isActive = true;

        const response = await UploadModel.find(query);
        if(response.length) {
          const storageResp = await StorageService.get(response[0].filePath +'/'+ response[0].fileName);      
          if (typeof storageResp === 'string'){
            // return apiResponse.errorResponse(res, "File can not be downloaded: " + storageResp); 
            apiResponse.successResponse(res, storageResp);
          }
          else {
            res.set({
              'Content-Type': 'image/png',
              //'Content-Disposition': `attachment; filename="${response[0].fileName}"`
            });  
            const buf = Buffer.from(storageResp.Body);
            const base64 = `data:image/png;base64,${buf.toString("base64")}`;
            apiResponse.successResponse(res, base64);
          }           
        } else {
          apiResponse.errorResponse(res, "No Image Found")
        }
      } catch (error) {
        apiResponse.errorResponse(res, error.message)
      }
    }
    */

    uploadFileS3 = async (req, res, next) => {
        try {
          logger.info('Upload Attachment, Data By: ' + JSON.stringify(req.body))
          if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
          }
          const filePath = req.file.path
          const file = req.file
          // convert size bytes to MB
          const sizeInMB = file.size/1000000;
          if (sizeInMB > 5.1) {
            res.json({ error_code: 1, err_desc: "File size is exceeding 5MB" });
            return;
          }
          // add date and time in file-name
          const extension = file.originalname.split('.').pop()
          const name = file.originalname.split('.').slice(0, -1).join('.')
          const finalName = name + '.' + extension
          const filePathS3 = filePath
          const fileKey = filePathS3 + '/' + finalName
    
          // store file in s3
          const fileContent = fs.readFileSync(filePath);
          let storageResp = await StorageService.uploadFileS3(fileKey, fileContent);
          fs.unlinkSync(`${filePath}`); // DeleteFile Irrespective of status in server
          if (storageResp && storageResp.Location) {
            /*
            const data = {
              fileType: extension.toLowerCase(),
              filePath: filePathS3,
              fileName: finalName,
              fileSize: file.size,
              Bucket: storageResp.Bucket,
              key: storageResp.key,
              Location: storageResp.Location
            }
           
            const response = await UploadModel.insertMany([data]);
            */
            console.log("Successfully uploaded data to" + fileKey);
            return apiResponse.successResponseWithData(
              res,
              'Successfully Uploaded File',
              { url: storageResp.Location }
            )
          }
          else {
            return apiResponse.errorResponse(res, `Failed Uploading File : ${storageResp}`);
          }      
        } catch (error) {
          logger.error(error)
          apiResponse.errorResponse(res, error.message)
        }
      }
}

module.exports = new StorageController()