
var http = require('http');

var query = "";
var args = process.argv;


if(args.length <= 2) {
  query = "vargas solar";
}
else {

  for(var i=2; i < args.length; i++) {
      query += args[i] + ' ';
  }

} // else




GET( prepareSearchURL(query), function (data) {

  var ids = extractPublicationIDs(data);

  for(var i=0; i < ids.length; i++) {

    GET( prepareBibtexURL(ids[i]), function (data) {
      console.log(data);
    });

  } // for

  var next = extractNextPageURL(data);

}); // async


/*
var req = http.request('http://dl.acm.org/advsearch.cfm');

    var cfid    = page.match(/name="CFID" value="(.*)"/)[1];
    var cftoken = page.match(/name="CFTOKEN" value="(.*)"/)[1];
*/



////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////

function GET(url, callback) {

  var req = http.get(url);

  req.on('response', function (resp) {

    var data = "";

    resp.on('data', function (chunk) {
      data += chunk;
    });

    resp.on('end', function () {
      callback(data)
    });

  }); // async

} // func



function prepareSearchURL(query){

  var url = 'http://dl.acm.org/results.cfm?' +
        //'CFID='    + cfid  + '&' +
        //'CFTOKEN=' + cfid  + '&' +
      'allofem=' + encodeURIComponent(query) + '&' +
      'adv=1'    + '&' +
      'COLL=DL'  + '&' +
      'DL=ACM'
    ;

  return url;

} // func


function prepareBibtexURL(publicationID){

  var ids = publicationID.split('.');
  var id = ids[1];
  var parentID = ids[0];

  var url = 'http://dl.acm.org/downformats.cfm?' +
    'parent_id=' + parentID + '&' +
    'id=' + id + '&' +
    'expformat=bibtex'
  ;

  return url;

} // func


function extractPublicationIDs(data) {

  var regexp = new RegExp(/href="citation.cfm\?id=(.*)&coll/ig);
  var array = [];
  var ids = [];

  while ((array = regexp.exec(data)) != null) {
    ids.push( array[1] );
  }

  return ids;

} // func


function extractNextPageURL(page) {

  var url = "";

  var regexp = new RegExp(/(.*)next/i);
  url = page.match(regexp);

  return url;

} // func
