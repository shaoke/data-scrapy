/**
 * Created by Shaoke Xu on 5/5/18.
 */
const express = require('express');
const {URL} = require('url');
const puppeteer = require('puppeteer');

const config = require('./config');
const logger = require('./util/logger')(__filename);

const parseUrl = function(url) {
  try{
    url = decodeURIComponent(url);
    let urlObj = new URL(url);
    if(urlObj.protocol === 'http:' || urlObj.protocol === 'https:'){
      return url;
    }else{
      return undefined;
    }
  }catch (err){
    logger.error(err);
    return undefined;
  }
};

function createRouter(){
  const router = express.Router();

  // middleware that is specific to this router
  router.use(function timeLog (req, res, next) {
    logger.info('Time: ', Date.now());
    next();
  });

  // define the home page route
  router.get('/', function (req, res) {
    res.send('Welcome to Date Spider Puppeteer!');
  });

  router.get('/screenshot', function (req, res) {
    let urlToScreenshot = parseUrl(req.query&&req.query.url);
    if(urlToScreenshot){
      logger.info("urlToScreenshot: ", urlToScreenshot);
      (async()=>{
        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(urlToScreenshot);
        await page.screenshot().then(function(buffer){
          res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
          res.setHeader('Content-Type', 'image/png');
          res.send(buffer);
        });

        await browser.close();
      })();
    }else{
      if(req.query&&req.query.url){
        res.send("Invalid URL: " + req.query&&req.query.url);
      }else{
        res.send("Please provide url query. For example: ?url=https://google.com");
      }
    }
  });

  return router;
}

module.exports = createRouter;