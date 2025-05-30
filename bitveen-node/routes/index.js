const express = require("express");

const router = express.Router();

const authStrategy = require('../common/authentication/middlewares/authStrategy')
const { handleError } = require('../common/apiHandler/controllers/request-errorHandler')

const {
  issueSessionRecord,
  terminateSession,
  collectUserSession,
  validateAndUpdateSession
} = require('../common/authentication/middlewares/session')
const {
  AccessToken,
  validateAccessToken
} = require('../common/authentication/middlewares/accessToken')

const loginRoute = require("./LoginRoutes");
const userRoute = require("./UserRoutes");
const articleRoute = require("./ArticleRoutes");
const storageRoute = require('./storageRoute')
const heartRoute = require('./HeartRoutes')
const reportArticleRoute = require('./ReportArticleRoutes.js');
const UserController = require("../controllers/UserController");
const commentsRoute = require('./CommentRoutes');
const replyRoute = require('./ReplyRoutes.js');
const savedArticleRoute = require('./SavedArticleRoutes.js')
const ArticleController = require("../controllers/ArticleController");
router.get(
  '/',
  async (req, res, next) => {
    res.status(200).send('hello world')
  },
  handleError,
)
router.use('/login', authStrategy, issueSessionRecord, AccessToken, loginRoute);
router.post('/user', UserController.createUser)
router.post('/article-link', ArticleController.getArticleByLink)
router.get('/article-username', ArticleController.getArticleByUsername)
router.get('/article-info', ArticleController.getArticleInfo)
router.get('/article-by-pag', ArticleController.getAllByPagination)

router.use("/user",
  collectUserSession,
  validateAccessToken,
  validateAndUpdateSession,
  userRoute);

router.use("/article",
  collectUserSession,
  validateAccessToken,
  validateAndUpdateSession,
  articleRoute);

router.use("/heart",
  collectUserSession,
  validateAccessToken,
  validateAndUpdateSession,
  heartRoute);
  
router.use("/reportArticle",
  collectUserSession,
  validateAccessToken,
  validateAndUpdateSession,
  reportArticleRoute);

  router.use("/comment", collectUserSession, validateAccessToken, validateAndUpdateSession,
  commentsRoute);

  router.use("/reply", collectUserSession, validateAccessToken, validateAndUpdateSession,
  replyRoute);
  
  router.use("/savedArticle", collectUserSession, validateAccessToken, validateAndUpdateSession,
  savedArticleRoute);

router.use(
  '/storage',
  collectUserSession,
  validateAccessToken,
  validateAndUpdateSession,
  storageRoute
)
router.get(
  '/logout',
  collectUserSession,
  terminateSession,
  async (req, res, next) => {
    res.status(200).json({ message: 'logout success' })
  },
  handleError,
)

router.use((req, res) => {
  res
    .status(404)
    .send({ message: "Not found.", status: 404, success: false });
});
module.exports = router;
