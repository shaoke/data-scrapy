/**
 * Created by Shaoke Xu on 5/5/18.
 */
const express = require('express');

const config = require('./config');
const logger = require('./util/logger')(__filename);

function createRouter(){
  const router = express.Router();

  // middleware that is specific to this router
  router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  // define the home page route
  router.get('/', function (req, res) {
    res.send('Welcome to Date Spider Puppeteer!');
  });

  return router;
}

module.exports = createRouter;