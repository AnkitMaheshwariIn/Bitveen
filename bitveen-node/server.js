// Load environment variables from .env file
require('dotenv').config();

const conf = require("./conf/conf");
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');

const { dbConnect } = require('./controllers/db')
const router = require('./routes');
const { getArticleMetaInfoByLink } = require("./controllers/ArticleController");

// Certificate
const privateKey = fs.readFileSync('./letsencrypt/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./letsencrypt/cert.pem', 'utf8');
const ca = fs.readFileSync('./letsencrypt/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const appStart = () => {
    const app = express()

    // Middleware function to check the origin of incoming requests
    function blockUnknownOrigins(req, res, next) {
      // add middeware to check ALLOWED_ORIGINS only when the URL path starts with '/api/'
      if (req.originalUrl.startsWith('/api/')) {
        const origin = req.headers.origin;
        // conf.ALLOWED_ORIGINS, is a whitelist of trusted origins
        if (!conf.ALLOWED_ORIGINS.includes(origin)) {
          return res.status(403).send('Access Denied, invalid request. ' + origin);
        }
      }
      next();
    }

    // Use the middleware function in your Express app
    app.use(blockUnknownOrigins);
  
    app.use(cors())
    app.use(bodyParser.json({limit: '10mb'}))
    app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }))
    app.use((req, res, next) => {
      req.response = {}
      next()
    })

    // Handle GET requests to /api route
    app.use('/api/', router)

    // All other GET requests not handled before will return our React app
    app.get('/', (req, res) => {
      handleClientReq(req, res);
    });

    // Have Node serve the files for our built React app
    app.use(express.static(path.resolve(__dirname, './client/build')));

    // Read the index.html file, replace __PAGE_META__ with the meta tags we want and send the updated content.
    const pathToIndex = path.resolve(__dirname, './client/build', 'index.html');
    
    const handleClientReq = (req, res) => {
      try {
        // res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
        fs.readFile(pathToIndex, 'utf8', (err, htmlData) => {
          if (err) {
              console.error('Error during file reading', err);
              return res.status(404).end()
          }

          let META_TAGS_DATA = {
            title: "Bitveen.com | START WRITING BLOGS",
            description: "If you have content to write, knowledge to share, an information to spread, or to tell about your business — use Bitveen.com - Signin for free.",
            image: "https://bitveen.com/logo192.png",
            url: "https://www.bitveen.com/"
          }

          // get article meta details
          const originalUrl = req.originalUrl;
          if (originalUrl) {
            const linkPath = originalUrl.replace(/\//g, '');
            console.log('linkPath: ', linkPath);

            // get article link META data
            if (linkPath) {
              getArticleMetaInfoByLink((articleMetaInfo) => {
                console.log('articleMetaInfo: ', articleMetaInfo);

                if (articleMetaInfo) {
                  if (META_TAGS_DATA.title) META_TAGS_DATA.title = articleMetaInfo.title
                  if (META_TAGS_DATA.description) META_TAGS_DATA.description = articleMetaInfo.subTitle
                  if (META_TAGS_DATA.image) META_TAGS_DATA.image = articleMetaInfo.headerImage
                }
            
                // set default META TAGS
                let META_TAGS = `
                  <title>"${META_TAGS_DATA.title}"</title>
                  <link rel="canonical" href="https://www.bitveen.com/" />
                  <meta name="title" content="${META_TAGS_DATA.title}" />
                  <meta name="description" content="${META_TAGS_DATA.description}" />
                  <meta property="og:url" content="${META_TAGS_DATA.url}" />
                  <meta property="og:type" content="article" />
      
                  <meta name="title" property="og:title" content="${META_TAGS_DATA.title}" />
                  <meta name="description" property="og:description" content="${META_TAGS_DATA.description}" />
                  <meta name="image" property="og:image" itemprop="image" content="${META_TAGS_DATA.image}" />
      
                  <meta name="title" property="twitter:title" content="${META_TAGS_DATA.title}" />
                  <meta name="description" property="twitter:description" content="${META_TAGS_DATA.description}" />
                  <meta name="image" property="twitter:image" itemprop="image" content="${META_TAGS_DATA.image}" />
                  <meta name="twitter:card" content="summary_large_image">


                `;
      
                // inject meta tags
                // htmlData = htmlData.replace(/<title> | Bitveen.com<\/title>/, "<title>Hello World!! 1234</title>");
                htmlData = htmlData.replace(/\<\/head>/g, META_TAGS + '</head>');
                htmlData = htmlData.replace("__PAGE_META__", META_TAGS)

                return res.send(htmlData);
              }, linkPath)
            } else {
              // if link not found meand base URL or non article page
              htmlData = htmlData.replace("__PAGE_META__", "")
              return res.send(htmlData);
            }
          }
        });
      } catch (error) {
        console.log(`Error occurred to handleClientReq: ${error}`);
      }
    }
    // All other GET requests not handled before will return our React app
    app.get('/*', (req, res) => {
      handleClientReq(req, res);
    });
    // All other GET requests not handled before will return our React app
    app.get('*', (req, res) => {
      handleClientReq(req, res);
    });

    // app.use((req, res) => {
    //     // if not match any route
    //     res.status(404).send({ message: 'Not found.', status: 404, success: false })
    // })
      
    // Starting both http & https servers
    const httpServer = require('http').createServer(app);
    const httpsServer = require('https').createServer(credentials, app);

    console.log('Starting both http & https servers')
    httpServer.listen(conf.PORT_HTTP, () => console.log(`Listening on HTTP port ${conf.PORT_HTTP}`))
    httpsServer.listen(conf.PORT_HTTPS, () => console.log(`Listening on HTTPS port ${conf.PORT_HTTPS}`))
}

const dbConnectionAndStartApp = async () => {
    await dbConnect()
    appStart()
}

const startServer = async () => {
    try {
      await dbConnectionAndStartApp()
    } catch (error) {
      console.log(`Error occurred while trying to connect to database: ${error}`)
      console.log(`DB URI: ${conf.DB_URI}`)
      return process.exit(1)
    }
}
  
startServer()
  
module.exports.server = startServer