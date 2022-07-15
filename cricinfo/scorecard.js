const request = require("request");
const cheerio = require("cheerio");
const xlsx=require("xlsx");
const fs=require("fs");
const path=require("path");
const { func } = require("assert-plus");

// const url =
//   "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/chennai-super-kings-vs-kolkata-knight-riders-1st-match-1304047/full-scorecard";

function processscorecard(url) {
  request(url, cb);
  function cb(err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractMatchesDetails(html);
    }
  }
}

// request(url, cb);

// function cb(err, response, html) {
//   if (err) {
//     console.log(err);
//   } else {
//     extractMatchesDetails(html);
//   }
// }

function extractMatchesDetails(html) {
  //   console.log(html);
  let $ = cheerio.load(html);
  // for venue and Date..
  let descElem = $(".ds-px-4 .ds-flex .ds-grow .ds-text-ui-typo-mid");
  // for result of the match..
  let result = $(".ds-flex  .ds-text-compact-xxs > div > p > span");
  let stringArr = descElem.text().split(",");
  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  result = result.text();
  // console.log("venue " + venue);
  // console.log("date " + date);
  // console.log("result " + result);

  let innings = $(".ds-flex .ds-grow .ds-mt-3 .ds-bg-fill-content-prime");
  for (let i = 0; i < innings.length; i++) {
    // htmlString += $(innings[i]).html();
    let teamName = $(innings[i])
      .find(".ds-mb-4 > .ds-flex  .ds-py-3 > .ds-font-bold")
      .text();
    teamName = teamName.split("INNINGS")[0].trim();
    let opponentIndex = i == 0 ? 1 : 0;
    let opponentTeamName = $(innings[opponentIndex])
      .find(".ds-mb-4 > .ds-flex  .ds-py-3 > .ds-font-bold")
      .text();
    opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();
    // console.log("venue " + venue);
    // console.log("date " + date);
    // console.log("result " + result);
    // console.log("teamname : " + teamName);
    // console.log("opponentTeamName :" + opponentTeamName);
    let cInning = $(innings[i]);
    let allRows = cInning.find(".ci-scorecard-table tbody tr");
    for (let j = 0; j < allRows.length; j++) {
      let isWorthy = $(allRows[j]).hasClass("ds-text-tight-s");
      if (isWorthy == true) {
        let allCols = $(allRows[j]).find("td");
        // console.log($(allCols[0]).text().trim());
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        // console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
        processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result);
      }
    }
  }
}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result) {
  let teamPath=path.join(__dirname,"ipl",teamName);
  dirCreater(teamPath);
  let filePath = path.join(teamPath,playerName+".xlsx");
  let content=excelReader(filePath,playerName);
  let playerObj ={
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    sr,
    opponentTeamName,
    venue,
    date,
    result
  }
  content.push(playerObj);
  excelWriter(filePath,content,playerName); 
}

function dirCreater(filePath){
  if(fs.existsSync(filePath)==false){
    fs.mkdirSync(filePath);
  }
}

function excelWriter(filePath,json,sheetName){
  let newWB=xlsx.utils.book_new();
  let newWS=xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
  xlsx.writeFile(newWB,filePath);
}

function excelReader(filePath,sheetName){
  if(fs.existsSync(filePath)==false){
    return [];
  }
  let wb=xlsx.readFile(filePath);
  let excelDate = wb.Sheets[sheetName];
  let ans=xlsx.utils.sheet_to_json(excelDate);
  return ans;
}

module.exports = {
  ps: processscorecard
}
