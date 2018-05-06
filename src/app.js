/**
 * Created by Shaoke Xu on 5/5/18.
 */
const express = require('express');

const logger = require('./util/logger')(__filename);
const createRouter = require('./router');


function createApp(){
  const app = express();
  logger.info("create app successful!");

  const router = createRouter();
  app.use('/', router);

  return app;
}

module.exports = createApp;