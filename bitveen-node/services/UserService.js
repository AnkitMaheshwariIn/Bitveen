const userModel = require('../models/UserModel.js');

class UserService {
    constructor() { }

    create = async (data) => {
        try {
            console.log('Data for user create', data);
            return await userModel.insertMany([data], { runValidators: true });
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findAll = async (query) => {
        try {
            console.log('Get User, Data By: ' + JSON.stringify(query))
            return await userModel.find(query)
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findUserByAggregate = async (query) => {
        try {
            console.log('Get User, Data By: ' + JSON.stringify(query))
            return await userModel.aggregate(query);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    findUserByQuery = async (query, options) => {
        try {
            console.log('Get User, Data By: ' + JSON.stringify(query))
            return await userModel.findOne(query, options).lean();
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    update =  async (userUUID, data, session) => {
        try {
          console.log('Update user, Data: ' + JSON.stringify(data))
          // find and update record in mongoDB
          return await userModel.findOneAndUpdate({ uuid: userUUID }, { $set: data }, { new: true, context: 'query', runValidators: true  })
        } catch (error) {
            console.log(error)
          throw new Error(error);
        }
      }

    updateFollowers =  async (data) => {
        try {
          console.log('Update user, Data: ' + JSON.stringify(data))
          // find and update record in mongoDB
          if(data.isFollow) {
                await userModel.updateMany(
                    { uuid: data.loggedInUserUUID },
                    { "$addToSet": { "following": data.followUUID } },
                    {upsert: false} 
                );

                await userModel.updateMany(
                    { uuid: data.followUUID },
                    { "$addToSet": { "followers": data.loggedInUserUUID } },
                    {upsert: false} 
                );
           } else  if(data.isFollow == false){
                await userModel.updateMany(
                    { uuid: data.loggedInUserUUID, following: {$in :data.followUUID} },
                    { "$pull": { "following": data.followUUID } },
                    {upsert: false} 
                );

                await userModel.updateMany(
                    { uuid: data.followUUID, followers: {$in :data.loggedInUserUUID} },
                    { "$pull": { "followers": data.loggedInUserUUID } },
                    {upsert: false} 
                );

           }
           return;
        } catch (error) {
            console.log(error)
          throw new Error(error);
        }
      }

}

module.exports = new UserService()