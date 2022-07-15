const request = require("request");
const cheerio = require("cheerio");
const AllmatchObj = require("./Allmatch");
const fs=require("fs");
const path=require("path");
const { dirname } = require("path");

const url =
  "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";

// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const iplPath = path.join(__dirname,"ipl");
dirCreater(iplPath);

request(url, cb);

function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    handleHtml(html);
  }
}

function handleHtml(html) {
  let $ = cheerio.load(html);
  let anchorElem = $(".ds-block .ds-text-center");
  let link = anchorElem.attr("href");
  let fulllink = "https://www.espncricinfo.com" + link;
  //   console.log(link);
  //   console.log(fulllink);
  AllmatchObj.fun(fulllink);
}

function dirCreater(filePath){
  if(fs.existsSync(filePath)==false){
    fs.mkdirSync(filePath);
  }
}
