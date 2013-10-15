var utils = require("../utils")
  , pg = require('pg').native

exports.action = {
  name: "communitiesList",
  description: "Fetches all communities. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: [
    {
      "name": "Another Community",
      "community_id": "1more",
      "about": "This my test community.",
      "members": 2
    },
    {
      "name": "Public",
      "community_id": "public",
      "about": "public",
      "members": 0
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select name, community_id__c, about__c, members__c from community__c order by name";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false});
        next(connection, true);
      })
    })
  }
};

exports.communitiesFetch = {
  name: "communitiesFetch",
  description: "Fetches a specific community. Method: GET",
  inputs: {
    required: ['id'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "leaderboard": [],
    "community": {
      "attributes": {
        "type": "Community__c",
        "url": "/services/data/v24.0/sobjects/Community__c/a12K0000001F6ipIAC"
      },
      "name": "Public",
      "email_domain": "no domain",
      "id": "a12K0000001F6ipIAC",
      "about": "public",
      "public_group": "All Members",
      "members": 0
    },
    "challenges": []
  },
  version: 2.0,
  run: function(api, connection, next){
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({ uri: 'v.9/communities/' + connection.params.id }, session.oauth, function(err, res) {
        if (err) { console.error(err); }
        var data = [res];
        utils.processResponse(data, connection);
        next(connection, true);
      });
    });
  }
};

exports.communitiesAddMember = {
  name: "communitiesAddMember",
  description: "Adds a member to a community. Method: POST",
  inputs: {
    required: ['membername', 'community_id'],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "Member added successfully."
  },
  version: 2.0,
  run: function(api, connection, mainNext){
    var next = function(data){
      connection.response.response = data;
      mainNext(connection, true);
    };

    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var timestamp = new Date().toISOString();
      var sql = "select id from member__c where name = $1";
      client.query(sql, [connection.params.membername], function(err, rs) {
        if (!err) {
          if (rs.rows.length > 0) {
            rs = {
              success: true,
              message: "Member already added."
            }
            next(rs);
          } else {
            var timestamp = new Date().toISOString();
            sql = "insert into community_member__c (username__c, name, lastmodifieddate, createddate, community__c, isdeleted, user__c) values ((select username__c from member__c where name = $1), $1, $2, $2, (select sfid from community__c where community_id__c = $3), false, (select sfid from member__c where name = $1))";
            client.query(sql, [connection.params.membername, timestamp, connection.params.community_id], function(err, rs) {
              if (!err) {
                rs = {
                  success: true,
                  message: "Member added successfully."
                }
              } else {
                rs = {
                  success: false,
                  message: "Member not added."
                }
                console.log(err);
              }
              next(rs);
            })
          }
        } else {
          rs = {
            success: false,
            message: "Member not added."
          }
          console.log(err);
          next(rs);
        }
      })
    })
  }
};
