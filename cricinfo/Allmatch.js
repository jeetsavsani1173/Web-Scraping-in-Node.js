const request = require("request");
const cheerio = require("cheerio");
const Obj = require("./scorecard");

function getAllMatchesLink(url) {
  request(url, cb2);
  function cb2(err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractLink(html);
    }
  }
  //   console.log(url);
}

function extractLink(html) {
  // console.log(html);
  let $ = cheerio.load(html);
  // let contentArr1 = $(".ds-flex .ds-mx-4 .ds-inline-flex");
  let contentArr1 = $(".ds-flex .ds-mx-4 > span");
  // let contentArr2 = $(".ds-text-tight-s .ds-font-regular");

  console.log(contentArr1.length);
  // console.log(contentArr2.length);

  for (let i = 2; i < contentArr1.length; i += 4) {
    let link = $(contentArr1[i]).find("a").attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    // console.log(fullLink);
    Obj.ps(fullLink);
  }
}

module.exports = {
  fun: getAllMatchesLink
}
