const express = require('express');
const config = require('../config/config');
const passport = require('passport');
require('../util/passport')(passport);
const responseFactory = require("../util/ResponseFactory")();

function APIRouter(app) {
    let router = express.Router();
     //eta son
    return router;
}

APIRouter.prototype = Object.create(APIRouter.prototype);

module.exports = APIRouter;