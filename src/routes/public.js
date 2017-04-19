const express = require('express');
const config = require('../config/config');
const passport = require('passport');
require('../util/passport')(passport);
const responseFactory = require("../util/ResponseFactory")();

function PublicRouter(app) {
    let router = express.Router();
    
    router.get('/', (req, res) => {
        return res.status(500).response("{error: 'Not ready'}");
    });

    return router;
}

PublicRouter.prototype = Object.create(PublicRouter.prototype);

module.exports = PublicRouter;