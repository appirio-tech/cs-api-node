// actionHero Config File
// I will be loded into api.configData

var fs = require('fs');
var cluster = require('cluster');

var configData = {};

/////////////////////////
// General Information //
/////////////////////////

configData.general = {
  apiVersion: "0.0.1",
  serverName: "CloudSpokes API",
  // id: "myActionHeroServer",                                    // id can be set here, or generated dynamically.  be sure that every server you run as a unique ID (which will happen when genrated dynamically)
  serverToken: "change-me",                                       // A unique token to your application which servers will use to authenticate to eachother
  welcomeMessage : "Hello! Welcome to the CloudSpokes API",        // The welcome message seen by TCP and webSocket clients upon connection
  flatFileDirectory: __dirname + "/public/",                      // The directory which will be the root for the /public route
  flatFileNotFoundMessage: "Sorry, that file is not found :(",    // The body message to acompany 404 (file not found) errors regading flat files
  serverErrorMessage: "The server experienced an internal error", // The message to acompany 500 errors (internal server errors)
  defaultChatRoom: "defaultRoom",                                 // the chatRoom that TCP and webSocket clients are joined to when the connect
  defaultLimit: 100,                                              // defaultLimit & defaultOffset are useful for limiting the length of response lists. 
  defaultOffset: 0,
  workers : 5,                                                    // The number of internal "workers" (timers) this node will have.
  developmentMode: true,                                         // watch for changes in actions and tasks, and reload/restart them on the fly
  pidFileDirectory: process.cwd() + "/pids/",                     // the location of the directory to keep pidfiles
  simultaneousActions: 5,                                          // how many pending actions can a single connection be working on 
  logAccessToken: true                                          // displays salesforce access token in console from login
};

/////////////
// logging //
/////////////

configData.logger = {
  transports: []
};

// console logger
if(cluster.isMaster){
  configData.logger.transports.push(function(api, winston){
    return new (winston.transports.Console)({
      colorize: true, 
      level: "debug", 
      timestamp: api.utils.sqlDateTime
    });
  });
}

// file logger
try{ 
  fs.mkdirSync("./log");
}catch(e){
  if(e.code != "EEXIST"){ console.log(e); process.exit(); }
}
configData.logger.transports.push(function(api, winston){
  return new (winston.transports.File)({
    filename: './log/' + api.pids.title + '.log',
    level: "info",
    timestamp: true
  });
});

///////////
// Redis //
///////////

configData.redis = {
  fake: true,
  host: "127.0.0.1",
  port: 6379,
  password: null,
  options: null,
  DB: 0,
};

///////////
// Salesforce //
///////////

configData.sfdc = {
  clientId: process.env.SFDC_CLIENT_ID,
  clientSecret: process.env.SFDC_CLIENT_SECRET,
  username: process.env.SFDC_USERNAME,
  password: process.env.SFDC_PASSWORD,
  environment: process.env.SFDC_ENVIRONMENT,
  callbackUrl: process.env.SFDC_CALLBACK_URL,
};

///////////
// Postgres //
///////////

configData.pg = {
  connString: process.env.CLOUDCONNECT_CONN,
};

///////////
// Defaults //
///////////

configData.defaults = {
  memberFields: "sfid as id,name,school__c,years_of_experience__c,gender__c,time_zone__c,profile_pic__c,country__c,summary_bio__c,quote__c,challenges_entered__c,total_money__c,website__c,twitter__c,linkedin__c,icq__c,jabber__c,github__c,facebook__c,digg__c,myspace__c,total_wins__c,total_points__c,total_1st_place__c,total_2nd_place__c,total_3st_place__c,valid_submissions__c,badgeville_id__c,active_challenges__c",
  paymentFields: 'p.sfid as id,p.name,c.name as challenge_name,c.challenge_id__c as challenge_id,p.money__c as money,p.place__c as place,p.reason__c as reason,p.status__c as status,p.type__c as type,p.Reference_Number__c,p.payment_sent__c as payment_sent'
};

//////////
// FAYE //
//////////

configData.faye = {
  mount: "/faye",
  timeout: 45,
  ping: null,
};

/////////////
// SERVERS //
/////////////

configData.servers = {
  "web" : {
    secure: false,                       // HTTP or HTTPS?
    serverOptions: {},                   // passed to https.createServer if secure=ture. Should contain SSL certificates
    port: 3001,                          // Port or Socket
    bindIP: "0.0.0.0",                   // which IP to listen on (use 0.0.0.0 for all)
    httpHeaders : {},                    // Any additional headers you want actionHero to respond with
    urlPathForActions : "api",           // route which actions will be served from; secondary route against this route will be treated as actions, IE: /api/?action=test == /api/test/
    urlPathForFiles : "public",          // route which static files will be served from; path (relitive to your project root) to server static content from
    rootEndpointType : "api",            // when visiting the root URL, should visitors see "api" or "file"? visitors can always visit /api and /public as normal
    directoryFileType : "index.html",    // the default filetype to server when a user requests a directory
    flatFileCacheDuration : 60,          // the header which will be returend for all flat file served from /public; defiend in seconds
    fingerprintOptions : {               // settings for determining the id of an http(s) requset (browser-fingerprint)
      cookieKey: "sessionID",
      toSetCookie: true,
      onlyStaticElements: false
    },
    formOptions: {                       // options to be applied to incomming file uplaods.  more options and details at https://github.com/felixge/node-formidable
      uploadDir: "/tmp",
      keepExtensions: false,
      maxFieldsSize: 1024 * 1024 * 100
    },
    returnErrorCodes: true              // when enabled, returnErrorCodes will modify the response header for http(s) clients if connection.error is not null.  You can also set connection.responseHttpCode to specify a code per request.
  },
}

//////////////////////////////////

exports.configData = configData;
