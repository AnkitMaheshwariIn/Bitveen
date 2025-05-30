const heartModel = require('../models/HeartModel');

class HeartService {
    constructor() { }

    put = async (data) => {
        try {
            console.log('Data for heart create', data);
            return heartModel.findOneAndUpdate({userUUID : data.userUUID, articleUUID: data.articleUUID}, { $set: data }, { new: true, context: 'query', runValidators: true, upsert:true } )
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findHeartsByQuery = async (query) => {
        try {
            console.log('Get heart, Data By: ' + JSON.stringify(query))
            return await heartModel.find(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findHeartsByAgg = async (query) => {
        try {
            console.log('Get heart, Data By: ' + JSON.stringify(query))
            return await heartModel.aggregate(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    update =  async (heartUUID, data, session) => {
        try {
          console.log('Update heart, Data: ' + JSON.stringify(data))
          // find and update record in mongoDB
          return await heartModel.findOneAndUpdate({ uuid: heartUUID }, { $set: data }, { new: true, context: 'query', runValidators: true  })
        } catch (error) {
            console.log(error)
          throw new Error(error);
        }
      }

    deleteHeart = async (query) => {
        try {
            console.log('Delete Heart by , Data: ' + JSON.stringify(query))
            
            // find and delete record in mongoDB
            return await heartModel.deleteOne(query)
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
}

module.exports = new HeartService()