var utils = require("../utils");

exports.leaderboardList = {
  name: "leaderboardList",
  description: "Fetches the leaderboard. Method: GET",
  inputs: {
    required: [],
    optional: ["limit"],
  },
  authenticated: false,
  outputExample: {
   this_year: [
    {
     total_money: "100.0",
     wins: "0",
     country: "United States",
     active: "6",
     profile_pic: "http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg",
     username: "jeffdonthemic"
    }
   ],
   
   all_time: [
    {
     total_money: "650.0",
     wins: "0",
     country: "United States",
     active: "6",
     profile_pic: "http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg",
     username: "jeffdonthemic"
    }
   ],

   this_month: [
    {
     total_money: "500.0",
     wins: "0",
     country: "United States",
     active: "2",
     profile_pic: "http://cs-public.s3.amazonaws.com/default_appirio_member_image.png",
     username: "salpartovi"
    }
   ]
  },
  version: 2.0,
  run: function(api, connection, next){
    var params = connection.rawConnection.parsedURL.query;
    var limit = params.limit;
    var url = "v.9/leaderboard_all";
    var reqParams = [];
    if (limit) reqParams.push({key: 'limit', value: limit});
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({uri: url, method: "GET", urlParams: reqParams}, session.oauth, function (err, resp) {
        if (!err && resp) {
          utils.processResponse(resp, connection);
          next(connection, true);
        }
      });
    });
  }
};

exports.leaderboardReferralList = {
  name: "leaderboardReferralList",
  description: "Fetches the leaderboard sorted by referrals. Method: GET",
  inputs: {
    required: [],
    optional: []
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    var query = "select count(id)total, referred_by_member__r.name, " +
      "referred_by_member__r.profile_pic__c, referred_by_member__r.country__c from Referral__c " +
      "where converted__c = true and referred_by_member__r.account__r.name = 'appirio' " +
      "group by referred_by_member__r.name, referred_by_member__r.profile_pic__c, referred_by_member__r.country__c";
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.query(query, session.oauth, function (err, resp) {
        if (!err && resp && resp.records) {
          utils.processResponse(resp.records, connection);
          next(connection, true);
        }
      });
    });
  }
};