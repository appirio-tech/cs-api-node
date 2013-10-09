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
  logAccessToken: process.env.LOG_ACCESS_TOKEN || true,    // displays salesforce access token in console from login
  skipAuthorization: process.env.SKIP_AUTH || false, // determined if the middleware check for an API Key should be skipped
  sessionDuration: (1000 * 60 * 60 * 1),              // values cached in redis for 1 hour
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
  fake: process.env.USE_FAKE_REDIS || true,
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
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
  paymentFields: "p.sfid as id,p.name,c.name as challenge_name,c.challenge_id__c as challenge_id,p.money__c as money,p.place__c as place,p.reason__c as reason,p.status__c as status,p.type__c as type,p.Reference_Number__c,p.payment_sent__c as payment_sent",
  challengeDetailsFields: "id,name,challenge_type__c,platforms__c,technologies__c,require_registration__c,docusign_document__c,license_type__r.name,license_type__r.url__c,account__c,contact__c,contact__r.name,discussion_board__c,additional_info__c,sponsor_logo__c,comments__c,contest_image__c,contest_logo__c,description__c,end_date__c,registration_end_date__c,is_open__c,prize_type__c,requirements__c,challenge_id__c,start_date__c,status__c,submissions__c,submission_details__c,winner_announced__c,review_date__c,registered_members__c,participating_members__c,total_prize_money__c,top_prize__c,terms_of_service__r.default_tos__c,post_reg_info__c,community_judging__c,community__r.name,community__r.community_id__c ,(select place__c, prize__c, value__c, points__c from challenge_prizes__r where is_active__c = true order by place__c),  (select filename__c from assets__r), (select id, createddate, member__r.name, status__c, has_submission__c from challenge_participants__r)",
  challengeListFields: "id,challenge_id__c,name,description__c,platforms__c,technologies__c,total_prize_money__c,challenge_type__c,days_till_close__c,registered_members__c,participating_members__c,start_date__c,end_date__c,is_open__c",
  challengeParticipantListFields: "member__r.profile_pic__c,member__r.name,member__r.total_wins__c,member__r.total_money__c,member__r.country__c,member__r.summary_bio__c,status__c,has_submission__c",
  scorecardsListFields: "id,name,member__r.name,member__r.profile_pic__c,member__r.country__c,challenge__c,money_awarded__c,prize_awarded__c,place__c,score__c,submitted_date__c",
  submissionListFields: "id,name,challenge__r.name,url__c,comments__c,type__c,username__c,challenge_participant__r.place__c,challenge_participant__c&orderby=username__c",
  participantsStatusFields: "id,name,send_discussion_emails__c,score__c,override_submission_upload__c,status__c,place__c,money_awarded__c,has_submission__c,apis__c,paas__c,languages__c,technologies__c,submission_overview__c,challenge__r.name,challenge__r.challenge_id__c,member__r.name,member__r.valid_submissions__c",
  sponsorsListFields: "sfid as id, name, can_admin_challenges__c, funds_available__c, logo__c",
  sponsorsDetailsFields: "sfid as id, name, can_admin_challenges__c, funds_available__c, logo__c"
};

/////////////////////////////////////////////
// Permitted fields to update in member__c //
/////////////////////////////////////////////
configData.whiteList = {
	memberUpdate: [ 'summary_bio__c', 'last_registration_date__c', 'school__c', 'appellate_member__c', 'profile_complete__c', 'email__c', 'github__c', 'jabber__c' ]
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
    port: process.env.PORT || 5000,  // Port or Socket
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
