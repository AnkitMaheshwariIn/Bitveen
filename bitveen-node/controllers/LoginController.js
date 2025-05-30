const userService = require('../services/UserService.js');
const apiResponse = require("../helper/apiResponse");

class Login {
    constructor() { }

    login = async (req, res, next) => {
        try {
            console.log('Login , Data By: ' + JSON.stringify(req.body))
            let existingUser = await userService.findUserByQuery(
                { 
                    username:  req.body.username,
                    password: req.body.password 
                })
                if(existingUser) {
                    existingUser.accessToken = res.locals.userToken
    
                    if (existingUser.accessToken) {
                        const authorizationHeader = `Bearer ${existingUser.accessToken}`
                        res.set({
                          Authorization: authorizationHeader
                        })
                        existingUser.accessToken = authorizationHeader
                    }
                    return res.status(200).send(existingUser)
                } else {
                    return res.status(404).send('User Not found')
                }
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    loginWithGoogle = async (req, res, next) => {
        try {
            console.log('Login , Data By: ' + JSON.stringify(req.body))
            // validate Google access_token
            if (!req.body.access_token) {
                return apiResponse.errorResponse(res, 'Google access_token Not Found');
            }

            const existingUser = res.locals.userDetails;
            if (existingUser) {
                existingUser.accessToken = res.locals.userToken

                if (existingUser.accessToken) {
                    const authorizationHeader = `Bearer ${existingUser.accessToken}`
                    res.set({
                      Authorization: authorizationHeader
                    })
                    existingUser.accessToken = authorizationHeader
                }
                existingUser.userUUID = existingUser.uuid;
                apiResponse.successResponseWithData(res, 'Signin successful', existingUser)
            } else {
                return res.status(404).send('User Not found')
            }
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }
}

module.exports = new Login()