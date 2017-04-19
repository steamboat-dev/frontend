const express = require('express');
const passport = require('passport');
const User = require('../shared/schema/user');
const APIRouter = require('../routes/api');
const PublicRouter = require('../routes/public');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ejs = require("ejs");
const responseFactory = require('../util/ResponseFactory')();

function HTTPServer(app) {
    var server = express();
    var httpServer = require("http").createServer(server);

    // Setup for parameters and bodies
    server.use(bodyParser.urlencoded({extended: false}));
    server.use(bodyParser.json());

    // Set rendering engine
    server.set('view engine', 'html');
    server.engine('html', ejs.renderFile);
 
    // Use public folder for resources
    server.use(app.config.sitePrefix, express.static('src/public'));

    // Log everything to console
    server.use(morgan('dev'));

    // needed when running behind nginx, or another proxy
    server.set('trust proxy', typeof app.config.trustProxyDepth === "number" ? app.config.trustProxyDepth : 0);

    server.use(passport.initialize())
    server.use((req, res, next) => {
        var userID = null;
        if(req.session) if(req.session.passport) userID = req.session.passport.user;
        if(userID) {
            User.findById(userID).then(user => {
                req.user = user;
                next();
            }).catch(err => {
                console.error("Error validating user session: " + err)
                next();
            });
            return;
        }
        next();
    });

    // Handle routes
    server.use(app.config.sitePrefix + '/api', APIRouter(app));
    server.use(app.config.sitePrefix + '/', PublicRouter(app));

    // 404
    server.use((req, res, next) => {
        res.status(404);
        // Respond with JSON if the client lieks dat
        if (req.accepts('json') && !req.accepts("html")) return res.send({ error: 'Not found' });
        res.redirect(app.config.sitePrefix + "/");
    });

    return {
        server: server,
        httpServer: httpServer
    }
}

HTTPServer.prototype = Object.create(HTTPServer.prototype);

module.exports = HTTPServer;