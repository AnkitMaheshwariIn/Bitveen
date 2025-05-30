// const bcrypt = require('bcrypt')
const { IsValidString, IsEmptyObject } = require('../../../helper/helperFunctions')
const { BadRequestError, NotFoundError } = require('../../../middlewares/errorHandler/clientError')
const logger = require('../../logging/services/logger').loggers.get('general')
const apiResponse = require('../../../helper/apiResponse')
const CryptoJS = require("crypto-js");
const conf = require("../../../conf/conf");
const UserService = require('../../../services/UserService')
var google = require('googleapis').google;

/**
 * Local Strategy Middleware
 *
 * @method localStrategy
 * @param {string} req request object
 * @param {object} res response object
 * @param {object} next middleware function
 */

const localStrategy = async (req, res, next) => {
  // destructure username and password from request body
  const { username, password, access_token } = req.body
  // return if either username or password are invalid.
  if (!access_token) {
    if (!IsValidString(username)) {
      next(new BadRequestError('Missing username.'))
    }
    if (!IsValidString(password)) {
      next(new BadRequestError('Missing password.'))
    }

    try {
      // query user from DB
      let user = await UserService.findUserByAggregate([
        {
          $match: {
            username: username
          }
        },
        {
          $project:{
            username:1,
            password:1,
            uuid:1,
            email:1,
            admin:1,
            isActive:1
          }
        }
      ]);
      
      user = user && user.length > 0 ? user[0] : {};

      // return if username was not found
      if (IsEmptyObject(user)) {
        //return next(new NotFoundError('Username not found in the database.'))
        return apiResponse.unauthorizedResponse(res, 'Invalid username. Please enter credentials Again')
      }
      
      // destructure hash
      const { password: passwordHash } = user
      // return if no hash
      if (!IsValidString(passwordHash)) {
      // return next(new NotFoundError('A password has not been set for this account.'))
        return apiResponse.unauthorizedResponse(res, 'A password has not been set for this account.')
      }

      // return if user isActive false
      if(!user.isActive) {
        return apiResponse.unauthorizedResponse(res, 'User Has Been Disabled Contact Admin')
      }

      // decrypt incoming password
      // var UserPass = CryptoJS.AES.decrypt(password, 'bitveen');
      // UserPass = UserPass.toString(CryptoJS.enc.Utf8);

      // // // decrypt db password
      // var dbPass = CryptoJS.AES.decrypt(passwordHash, 'bitveen');
      // dbPass = dbPass.toString(CryptoJS.enc.Utf8);

      //const match = dbPass === UserPass
      const match = user.password === password
      // const match = await bcrypt.compare(password, passwordHash);
      // return if passwords match
      if (match) {
        res.locals.userDetails = {
          userId: user.uuid,
          username: user.username,
          // email: user.email,
          //passwordReset : user.passwordReset,
          //userRole: user.userRole
        }
        return next()
      }
      // return if no match
      // return next(new BadRequestError('Invalid password.'))
      return apiResponse.unauthorizedResponse(res, 'Invalid password. Please enter credentials again!')
    
    } catch (error) {
      logger.error(`Local Auth Strategy Failed: ${error}`)
      //next(new BadRequestError('Failed to authenticate user.'))
      return apiResponse.unauthorizedResponse(res, 'Failed to authenticate user.')
    }
  } else {
    // login with Google access_token
    if (!IsValidString(access_token)) {
      next(new BadRequestError('Missing access_token.'))
    }

    try {
      var OAuth2 = google.auth.OAuth2;
      var oauth2Client = new OAuth2();
      oauth2Client.setCredentials({access_token: access_token});
      var oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
      });
      oauth2.userinfo.get(
        function(err, res) {
          if (err || !res.data) {
            console.log(err);
            return apiResponse.unauthorizedResponse(res, 'Invalid auth token. Please signin again.')
          } else {
            // console.log(res);
            verifyGLogin(res.data)
          }
      });


      const verifyGLogin = async (payload) => {
        // query user from DB, with an email id received from Google auth
        let user = await UserService.findUserByAggregate([
          {
            $match: {
              email: payload.email
            }
          },
          {
            $project: {
              username:1,
              uuid:1,
              email:1,
              admin:1,
              isActive:1,
              firstName:1,
              lastName:1,
              userImage:1
            }
          }
        ]);
        
        user = user && user.length > 0 ? user[0] : {};

        // return 'new' if user not found with Google, new will register new user in database
        if (IsEmptyObject(user)) {
            // User Not found, create new user
            const newUserObj = {
              username: payload.email,
              name: payload.name,
              firstName: payload.given_name,
              lastName: payload.family_name,
              email: payload.email,
              verifiedEmail: payload.verified_email,
              locale: payload.locale,
              userImage : {
                URL: payload.picture
              },
              socialLogin: 'Google',
              socialLoginId: payload.id
            }
            let resp = await UserService.create(newUserObj);
            if (!resp) {
                apiResponse.errorResponse(res, 'Create new user failed. Please try again.')     
            } else {
              res.locals.userDetails = resp[0]._doc;
              return next()
            }
        }

        // return if user isActive false
        if(!user.isActive) {
          return apiResponse.unauthorizedResponse(res, 'User Has Been Disabled Contact Admin')
        }

        // decrypt incoming password
        // var UserPass = CryptoJS.AES.decrypt(password, 'bitveen');
        // UserPass = UserPass.toString(CryptoJS.enc.Utf8);

        // // // decrypt db password
        // var dbPass = CryptoJS.AES.decrypt(passwordHash, 'bitveen');
        // dbPass = dbPass.toString(CryptoJS.enc.Utf8);

        //const match = dbPass === UserPass
        const match = payload.email === user.email
        // const match = await bcrypt.compare(password, passwordHash);
        // return if passwords match
        if (match) {
          res.locals.userDetails = user;
          return next()
        }
        // return if no match
        // return next(new BadRequestError('Invalid password.'))
        return apiResponse.unauthorizedResponse(res, 'Invalid password. Please enter credentials again!')
      
      }
    } catch (error) {
      logger.error(`Local Auth Strategy Failed: ${error}`)
      //next(new BadRequestError('Failed to authenticate user.'))
      return apiResponse.unauthorizedResponse(res, 'Failed to authenticate user.')
    }
  }
}

module.exports = localStrategy
