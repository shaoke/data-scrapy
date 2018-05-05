/**
 * Created by Shaoke Xu on 4/29/18.
 */
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 3000;
const {URL} = require('url');

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
    console.log(err);
    return undefined;
  }
};

app.get('/', (req, res)=>{
  let urlToScreenshot = parseUrl(req.query&&req.query.url);
  if(urlToScreenshot){
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
    res.send("Invalid URL: " + req.query&&req.query.url);
  }
});

app.listen(port, function() {
  console.log('App listening on port ' + port)
});