const ArticleService = require('../services/ArticleService.js');
const {v4: uuidv4} = require('uuid');
const UserService = require('../services/UserService.js');
const UserModel = require('../models/UserModel.js');
const apiResponse = require("../helper/apiResponse");

class Article {
    constructor() { }
    
    // Get Article by Link without login
    getArticleMetaInfoByLink = async (callback, articleLink) => {
      try {
          console.log('Find Article, Data By: ' + JSON.stringify(articleLink))
          if(!articleLink) {
              throw new Error('Link Not Found');
          }
          let query = {}
          query.articleLink = articleLink;

          let pipeline = [
            {
              $match: query
            },
            // {
            //   $lookup: {
            //     from: 'user',
            //     let: {
            //       userID: '$userUUID'
            //     },
            //     pipeline: [
            //       {
            //         $match: {
            //           $expr: {
            //             $and: [
            //               {
            //                 $eq: ['$$userID', '$uuid']
            //               }
            //             ]
            //           }
            //         }
            //       },
            //       {
            //         $project: {
            //           _id:0, firstName: 1, lastName: 1, username: 1, userImage: 1, followersCount: {$size:"$followers"},
            //           isFollowedByLoggedinUser: {$size: { $setIntersection: ['$followers', [data.userUUID]] }}
            //         }
            //       }
            //     ],
            //     as: 'user'
            //   }
            // },
            // {
            //   $unwind: {
            //     path: "$user",
            //     preserveNullAndEmptyArrays: false
            //   }
            // },
            // {
            //   $lookup: {
            //     from: 'comments',
            //     localField: 'uuid',
            //     foreignField: 'articleUUID',
            //     as: 'comments'
            //   }
            // },
            // {
            //   $lookup: {
            //     from: 'heartCount',
            //     let:{
            //       articleID: '$uuid',
            //     },
            //     pipeline:[
            //       {
            //         $match: {
            //           $expr:{
            //             $and:[
            //               {
            //                 $eq:['$$articleID', '$articleUUID']
            //               },
            //               // {
            //               //   $in:['$followers', [req?.query?.loggedinUserUUID]]
            //               // },
            //             ]
            //           }
            //         }
            //       },
            //       {
            //         $group: {
            //             _id: '',
            //             "heartCount": { $sum: '$heartCount' }
            //         }
            //       },
            //       {
            //         $project: {
            //             _id: 0,
            //             "TotalHeartCount": '$heartCount'
            //         }
            //       }
            //     ],
            //     as: 'heart'
            //   }
            // },
            {
              $project: {
                _id:0,
                uuid:1,
                userUUID:1,
                // blocks:1,
                title:1,
                topics:1,
                headerImage:1,
                subTitle:1,
                articleLink:1,
                createdAt:1,
                // below are details from other documents
                // articleUUID: "$uuid",
                // userInfo: "$user",
                // commentCount: {$size:"$comments"},
                // heartCount: "$heart.TotalHeartCount",
              } 
            }
          ]

          // call method to service
          let result = await ArticleService.aggregation(pipeline);

          if (!result) {
            throw new Error('article not found in the database');
          }
          callback(result[0]);
      } catch (error) {
          console.error(error)
          throw new Error(error.message)
      }
    }
    
    // Get Article by Link without login
    getArticleByLink = async (req, res, next) => {
        try {
            console.log('Find Article, Data By: ' + JSON.stringify(req.body))
            let data = req.body;

            if(!data.articleLink) {
                throw new Error('Link Not Found');
            }
            let query = {}
            query.articleLink = data.articleLink

            let pipeline = [
              {
                $match: query
              },
              {
                $lookup: {
                  from: 'user',
                  let: {
                    userID: '$userUUID'
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ['$$userID', '$uuid']
                            }
                          ]
                        }
                      }
                    },
                    {
                      $project: {
                        _id:0, firstName: 1, lastName: 1, username: 1, userImage: 1, followersCount: {$size:"$followers"},
                        isFollowedByLoggedinUser: {$size: { $setIntersection: ['$followers', [data.userUUID]] }}
                      }
                    }
                  ],
                  as: 'user'
                }
              },
              {
                $unwind: {
                  path: "$user",
                  preserveNullAndEmptyArrays: false
                }
              },
              {
                $lookup: {
                  from: 'comments',
                  localField: 'uuid',
                  foreignField: 'articleUUID',
                  as: 'comments'
                }
              },
              {
                $lookup: {
                  from: 'heartCount',
                  let:{
                    articleID: '$uuid',
                  },
                  pipeline:[
                    {
                      $match: {
                        $expr:{
                          $and:[
                            {
                              $eq:['$$articleID', '$articleUUID']
                            },
                            // {
                            //   $in:['$followers', [req?.query?.loggedinUserUUID]]
                            // },
                          ]
                        }
                      }
                    },
                    {
                      $group: {
                          _id: '',
                          "heartCount": { $sum: '$heartCount' }
                      }
                    },
                    {
                      $project: {
                          _id: 0,
                          "TotalHeartCount": '$heartCount'
                      }
                    }
                  ],
                  as: 'heart'
                }
              },
              {
                $project: {
                  _id:0,
                  uuid:1,
                  userUUID:1,
                  blocks:1,
                  title:1,
                  topics:1,
                  headerImage:1,
                  subTitle:1,
                  articleLink:1,
                  createdAt:1,
                  // below are details from other documents
                  articleUUID: "$uuid",
                  userInfo: "$user",
                  commentCount: {$size:"$comments"},
                  heartCount: "$heart.TotalHeartCount",
                } 
              }
            ]

            // call method to service
            let result = await ArticleService.aggregation(pipeline);

            if (!result) {
                return res.status(404).send('article not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    getArticleInfo = async (req, res, next) => {
        try {
            console.log('Find Article, Data By: ' + JSON.stringify(req.query))
            if( !req.query.articleUUID) {
                throw new Error('articleUUID  Not Found');
            }
            let query = {}
            query.uuid = req.query.articleUUID
            let pipeline = [
                {
                    $match: query
                },
                {
                    $lookup: {
                      from: 'comments',
                      localField: 'uuid',
                      foreignField: 'articleUUID',
                      as: 'comments'
                    }
                },
                {
                    $lookup: {
                      from: 'heartCount',
                      localField: 'uuid',
                      foreignField: 'articleUUID',
                      as: 'heartCount'
                    }
                },
                {
                  $unwind: {
                    path: "$heartCount",
                    preserveNullAndEmptyArrays: false
                  }
                },
                {
                    $lookup: {
                      from: 'savedArticle',
                      let:{
                        articleID: '$uuid',
                      },
                      pipeline:[
                        {
                          $match: {
                            $expr:{
                              $and:[
                                {
                                  $eq:['$$articleID', '$articleUUID']
                                },
                                {
                                  $eq:[req?.query?.loggedinUserUUID, '$userUUID']
                                },
                              ]
                            }
                          }
                        }
                      ],
                      as: 'savedArticle'
                    }
                },
                {
                  $lookup: {
                    from: 'user',
                    let:{
                      userID: '$userUUID',
                    },
                    pipeline:[
                      {
                        $match: {
                          $expr:{
                            $and:[
                              {
                                $eq:['$$userID', '$uuid']
                              },
                              {
                                $in:['$followers', [req?.query?.loggedinUserUUID]]
                              },
                            ]
                          }
                        }
                      }
                    ],
                    as: 'user'
                  }
                },
                {
                    $project:{
                            _id:0,
                            articleUUID:"$uuid",
                            commentCount:{$size:"$comments"},
                            heartCount: "$heartCount.heartCount",
                            isSaved:{ $cond: { if: {$size:"$savedArticle"}, then: true, else: false } },
                            isFollowed :{ $cond: { if: {$size:"$user"}, then: true, else: false }},
                    }
                        
                }
            ]
            // call method to service
            let result = await ArticleService.aggregation(pipeline);

            if (!result) {
                return res.status(404).send('article not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    // Get Article by username without login
    getArticleByUsername = async (req, res, next) => {
        try {
            console.log('Find Article, Data By: ' + JSON.stringify(req.query))
            if (!req.query.username) {
              return apiResponse.errorResponse(res, 'Link Not Found');
            }
            let query = {}
            
            const  userDetail = await UserModel.findOne({username: req.query.username }, {_id:0, uuid: 1, username:1,firstName: 1, lastName: 1}).lean()
            if (userDetail) {
                query.userUUID = userDetail.uuid
            } else {
              return apiResponse.errorResponse(res, `User not found ${req.query.username}`)
            }
            const displayName = `${userDetail.firstName} ${userDetail.lastName}`

            // call method to service
            let result = await ArticleService.findAll(query);

            if (!result) {
                return res.status(404).send('article not found in the database')
            }
            return apiResponse.successResponseWithData(res, '', {
              displayName,
              articleList: result
            })
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    // By userUUID or username or articleLink
    findAllBy = async (req, res, next) => {
        try {
            console.log('Find Article, Data By: ' + JSON.stringify(req.params))
            let query = { isActive: true };
            if (req.query.uuid) {
                query.uuid = req.query.uuid
            }
            if (req.query.userUUID) {
                query.userUUID = req.query.userUUID
            }
            if(req.query.username) {
                const  userDetail = await UserModel.findOne({username: req.query.username }, {_id:0, uuid: 1, username:1}).lean()
                if(userDetail) {
                  query.userUUID = userDetail.uuid
                } else {
                  return apiResponse.errorResponse(res, `User not found ${req.query.username}`)
                }
            }

            // call method to service
            let result = await ArticleService.findAll(query);

            if (!result) {
                return res.status(404).send('article not found')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    // By login userUUID and remove blocked users article, if blocked.
    findAll = async (req, res, next) => {
        try {
            console.log('Find Article, Data By: ' + JSON.stringify(req.params))
            let query = { isActive: true };
            if (!req.query.userUUID) throw new Error("User id is required.");
            // check if user have blockedUsers List, Remove that Blocked users Article
            const loginUser = await UserService.findUserByQuery({uuid: req.query.userUUID }, {blockedUsers:1, uuid:1})
            if(loginUser?.blockedUsers){
                { query.userUUID = {$nin : loginUser.blockedUsers}}
            }
            
            // call method to service
            let result = await ArticleService.findAll(query);

            if (!result) {
                return res.status(404).send('article not found in the database')
            }
            return res.status(200).send(result);
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }

    // By login userUUID and remove blocked users article, if blocked.
    getAllByPagination = async (req, res, next) => {
      try {
          console.log('Find Article, Data By: ' + JSON.stringify(req.query))
          let query = { isActive: true };
          /**
           * TODO: Get user firstName, lastName, userName, followersCount
           */
          
          
          /**
           * TODO: implement pagination here
           */

          let pipeline = [
            {
              $match: query
            },
            {
              $lookup: {
                from: 'user',
                let:{
                  userID: '$userUUID',
                },
                pipeline:[
                  {
                    $match: {
                      $expr:{
                        $and:[
                          {
                            $eq:['$$userID', '$uuid']
                          },
                          // {
                          //   $in:['$followers', [req?.query?.loggedinUserUUID]]
                          // },
                        ]
                      }
                    }
                  },
                  {
                    $project: {
                      _id:0, firstName: 1, lastName: 1, username: 1, userImage: 1, followersCount: {$size:"$followers"}
                    }
                  }
                ],
                as: 'user'
              },
            },
            {
              $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: false
              }
            },
            {
              $lookup: {
                from: 'comments',
                localField: 'uuid',
                foreignField: 'articleUUID',
                as: 'comments'
              }
            },
            {
              $lookup: {
                from: 'heartCount',
                let:{
                  articleID: '$uuid',
                },
                pipeline:[
                  {
                    $match: {
                      $expr:{
                        $and:[
                          {
                            $eq:['$$articleID', '$articleUUID']
                          },
                          // {
                          //   $in:['$followers', [req?.query?.loggedinUserUUID]]
                          // },
                        ]
                      }
                    }
                  },
                  {
                    $group: {
                        _id: '',
                        "heartCount": { $sum: '$heartCount' }
                    }
                  },
                  {
                    $project: {
                        _id: 0,
                        "TotalHeartCount": '$heartCount'
                    }
                  }
                ],
                as: 'heartCount'
              }
            },
            {
              $sort: {
                createdAt: -1 // -1 for desc & 1 for asc
              }
            },
            {
              $skip: req.query.skip ? Number(req.query.skip) : 0
            },
            {
              $limit: req.query.limit ? Number(req.query.limit) : 10
            },
            {
              $project: {
                _id:0,
                uuid:1,
                userUUID:1,
                blocks:1,
                title:1,
                topics:1,
                headerImage:1,
                subTitle:1,
                articleLink:1,
                createdAt:1,
                // below are details from other documents
                articleUUID: "$uuid",
                userInfo: "$user",
                commentCount: {$size:"$comments"},
                heartCount: "$heartCount",
              } 
            }
        ]
        // call method to service
        let result = await ArticleService.aggregation(pipeline);

        // call method to service
        // let result = await ArticleService.findAll(query);

        if (!result) {
            return res.status(404).send('article not found in the database')
        }
        return res.status(200).send(result);
      } catch (error) {
          console.error(error)
          res.status(400).send(error.message)
      }
  }

    createArticle = async (req, res, next) => {
      try {
        console.log('Create Article, Data By: ' + JSON.stringify(req.body))
        let data = req.body;

        // check if userUUID not found OR not matched with (session) logged in userUUID
        if (!data.userUUID || data.userUUID !== res.locals.session.userUUID) {
          return apiResponse.errorResponse(res, `User not found ${data.userUUID} or not matched with logged in user.`)
        }

        data.uuid = uuidv4(); // unique id for article

        // call method to service
        let resp = await ArticleService.create(data);
        apiResponse.successResponseWithData(res, 'Article saved successfully!', resp);
      } catch (error) {
        console.error(error)
        apiResponse.errorResponse(res, error.message)
      }
    }

    updateArticle = async (req, res) => {
        try {
          if (Object.keys(req.body).length === 0) {
            return apiResponse.notFoundResponse(res, `No article data found for update`);
          }
          let articleUUID = req.params.articleUUID
          if (!articleUUID) return apiResponse.errorResponse(res, "Please send articleUUID");
    
          const data = req.body;

          /* check if userUUID found in article object got from databases is matched with 
          ** (session) logged in userUUID or NOT! So as to make sure person editing article is owner.
          ** send articleUUID and get userUUID then match with session user UUID.
          */
          const userFromArticle = await ArticleService.findArticleById({uuid: articleUUID }, { userUUID: 1 });
          if (!userFromArticle[0] || userFromArticle[0].userUUID !== res.locals.session.userUUID) {
            return apiResponse.errorResponse(res, `User not found (${data.userUUID}) or user does not have permission to edit article.`)
          }

          data.updatedAt = new Date()
          // call method to service
          let resp = await ArticleService.update(articleUUID, data);
          if (resp) {
            apiResponse.successResponseWithData(res, 'Article updated successfully!', resp);
          } else {
            apiResponse.errorResponse(res, `No article found for the articleUUID provided:${articleUUID}`)
          }
        } catch (error) {
            console.log(error)
            apiResponse.errorResponse(res, error.message)
        }
    }

    deleteArticleByUUId = async (req, res, next) =>{
        try {
            console.log('Delete Article, Data By: ' + JSON.stringify(req.body))
            if (!req.params.uuid) throw new Error("Article UUID is required.");
            let uuid = req.params.uuid;
            // call method to service
            let resp = await ArticleService.deleteArticle(uuid, req);

            return res.status(200).send(resp)
        } catch (error) {
            console.error(error)
            res.status(400).send(error.message)
        }
    }
}

module.exports = new Article()