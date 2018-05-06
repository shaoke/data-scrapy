/**
 * Created by Shaoke Xu on 5/5/18.
 */
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('./util/logger')(__filename);
const errorResponder = require('./middleware/error-responder');
const errorLogger = require('./middleware/error-logger');
const createRouter = require('./router');
const config = require('./config');


function createApp(){
  const app = express();
  logger.info("create app successful!");

  // App is served behind Heroku's router.
  // This is needed to be able to use req.ip or req.secure
  app.enable('trust proxy', 1);
  app.disable('x-powered-by');

  if (config.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // Limit to 10mb if HTML has e.g. inline images
  app.use(bodyParser.text({ limit: '4mb', type: 'text/html' }));
  app.use(bodyParser.json({ limit: '4mb' }));

  app.use(compression({
    // Compress everything over 10 bytes
    threshold: 10,
  }));

  const router = createRouter();
  app.use('/', router);

  app.use(errorLogger());
  app.use(errorResponder());

  return app;
}

module.exports = createApp;