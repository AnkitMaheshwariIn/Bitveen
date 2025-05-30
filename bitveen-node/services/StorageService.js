var AWS = require('aws-sdk');

// AWS Credentials from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const endpoint = process.env.AWS_S3_ENDPOINT;
const bucket = process.env.AWS_S3_BUCKET;

// Validate required environment variables
if (!accessKeyId || !secretAccessKey || !bucket) {
    console.error('ERROR: AWS credentials are required in environment variables');
    // Don't exit the process here, just log the error
    // The service will fail when used if credentials are missing
}

// AWS S3 Client
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    endpoint: endpoint,
    s3ForcePathStyle: true
    // signatureVersion: 'v4'
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
