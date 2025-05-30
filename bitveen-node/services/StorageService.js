var AWS = require('aws-sdk');
const {settings} = require('../conf/default.json');
//const settings = config.get('settings');

//AWS Creds
const accessKeyId = settings.s3_access_key;
const secretAccessKey = settings.s3_secret_key;
const endpoint = settings.s3_endpoint;
const bucket = settings.s3_bucket;

//AWS S3 Client
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    endpoint: endpoint,
    s3ForcePathStyle: true
    //signatureVersion: 'v4'
});

class StorageService {

    constructor() { }
    //Key in params is S3 filePath or fileStorageKey
    //Body in params is the file buffer
    uploadFileS3 = (key, body) => new Promise((resolve, reject) => {
        var params = { Bucket: bucket, Key: key, Body: body, ACL: 'public-read' };
        s3.upload(params, function (err, data) {
            if (err)
                return resolve(err.message);
            else
                return resolve(data);
        });
    });

    // get = (key) => new Promise((resolve, reject) => {
    //     var params = { Bucket: bucket, Key: key };
    //     s3.getObject(params, function (err, data) {
    //         if (err)
    //             return resolve(err.message);
    //         else
    //             return resolve(data);
    //     });
    // });


    // get = (key) => new Promise((resolve, reject) => {
    //     var params = { Bucket: bucket, Key: key };
    //     s3.getSignedUrl('getObject', params, function (err, data) {
    //         if (err)
    //             return resolve(err.message);
    //         else
    //             return resolve(data);
    //     });
    // });


    delete = (key) => new Promise((resolve, reject) => {
        var params = { Bucket: bucket, Key: key };
        s3.deleteObject(params, function (err, data) {
            if (err)
                return resolve(err.message);
            else
                return resolve(200);
        });
    });
}

module.exports = new StorageService()
