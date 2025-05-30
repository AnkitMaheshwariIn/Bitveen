const UserService = require('../services/UserService');
const {v4: uuidv4} = require('uuid');
const apiResponse = require("../helper/apiResponse");

class User {
    constructor() { }

    findAll = async (req, res, next) => {
        try {
            console.log('Find User, Data By: ' + JSON.stringify(req.params))
            let query = { isActive: true };
            // call method to service
            let result = await UserService.findAll(query);

            if (!result) {
                return res.status(404).send('user not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    createUser = async (req, res, next) => {
        try {

            console.log('Create User, Data By: ' + JSON.stringify(req.body))
            let data = req.body;
            data.uuid = uuidv4(); // unique id for user

            // call method to service
            let resp = await UserService.create(data);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    updateUser = async (req, res) => {
        try {
          if (Object.keys(req.body).length === 0) {
            return apiResponse.notFoundResponse(res, `No user data found for update`);
          }
          if (!req.params.userUUID) return apiResponse.errorResponse(res, "Please send userUUID");
    
          const data = req.body
          data.updatedAt = new Date()
          let userUUID = req.params.userUUID
          // call method to service
          let resp = await UserService.update(userUUID, data);
          if (resp) {
            return  res.status(200).send(resp)
          } else {
            return res.status(400).send(`No user found for the userUUID provided:${userUUID}`);
          }
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
    }
        
    updateFollowers = async (req, res, next) => {
      try {
        console.log("follow/unfollow, Data By: " + JSON.stringify(req.body));
        let data = req.body;
  
        // call method to service
        let resp = await UserService.updateFollowers(data);
  
        return res.status(200).send("Updated Successfully");
      } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
      }
    };
}

module.exports = new User()