var utils = require("../utils")
  , _ = require("underscore")
  , pg = require('pg').native

exports.action = {
  name: "participantsStatus",
  description: "Returns the status for a challenge's member. Method: GET",
  inputs: {
    required: ['membername', 'challenge_id'],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "attributes": {
      "type": "Challenge_Participant__c",
      "url": "/services/data/v22.0/sobjects/Challenge_Participant__c/a0AK000000AqiApMAJ"
    },
    "challenge__r": {
      "attributes": {
        "type": "Challenge__c",
        "url": "/services/data/v22.0/sobjects/Challenge__c/a0GK0000006k4wjMAA"
      },
      "name": "First2Finish - Test Upload",
      "challenge_id": "22",
      "id": "a0GK0000006k4wjMAA"
    },
    "name": "CP-70894",
    "has_submission": true,
    "money_awarded": 0,
    "score": 0,
    "member__r": {
      "attributes": {
        "type": "Member__c",
        "url": "/services/data/v22.0/sobjects/Member__c/a0IK0000007NIQmMAO"
      },
      "valid_submissions": 0,
      "name": "jeffdonthemic",
      "id": "a0IK0000007NIQmMAO"
    },
    "member": "a0IK0000007NIQmMAO",
    "send_discussion_emails": true,
    "id": "a0AK000000AqiApMAJ",
    "status": "Submitted",
    "override_submission_upload": false,
    "challenge": "a0GK0000006k4wjMAA"
  },
  version: 2.0,
  run: function(api, connection, next){
    var url =  'v.9/participants/' + connection.params.membername + '?challengeId=' + connection.params.challenge_id + '&fields=' + api.configData.defaults.participantsStatusFields;
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({ uri: url }, session.oauth, function(err, res) {
        if (err) { console.error(err); }
        utils.processResponse(res, connection);
        next(connection, true);
      });
    });
  }
};

exports.participantsFetch = {
  name: "participantsFetch",
  description: "Returns a specific participant. Method: GET",
  inputs: {
    required: ['participant_id'],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "id": 1,
    "member": "a0IK0000007VVgFMAW",
    "member_name": "google-jeff",
    "member_profile_pic": "http://cs-public.s3.amazonaws.com/default_cs_member_image.png",
    "member_country": null,
    "challenge": "a0GK0000006i7xIMAQ",
    "challenge_name": "Yet Another Test Challenge",
    "challenge_id": "6",
    "money_awarded": 0,
    "place": null,
    "points_awarded": 0,
    "score": 0,
    "status": "Registered",
    "has_submission": false,
    "completed_scorecards": 0,
    "submitted_date": null,
    "send_discussion_emails": true
  },
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select sfid as id, member__c, (select name from member__c where sfid = member__c) as member_name, (select profile_pic__c from member__c where sfid = member__c) as member_profile_pic, (select country__c from member__c where sfid = member__c) as member_country, challenge__c, (select name from challenge__c where sfid = challenge__c) as challenge_name, (select challenge_id__c from challenge__c where sfid = challenge__c) as challenge_id, money_awarded__c, place__c, points_awarded__c, score__c, status__c, has_submission__c, completed_scorecards__c, submitted_date__c, send_discussion_emails__c from challenge_participant__c where sfid = $1";
      client.query(sql, [connection.params.participant_id], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection);
        next(connection, true);
      })
    })
  }
};

exports.participantsCreate = {
  name: "participantsCreate",
  description: "Creates a new challenge participant record. Method: POST",
  inputs: {
    required: ['membername', 'challenge_id'],
    optional: ['fields'],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "a0AK000000BiJTrMAN"
  },
  version: 2.0,
  run: function(api, connection, next){
    api.participants.create(connection.params, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.participantsUpdate = {
  name: "participantsUpdate",
  description: "Updates an existing challenge participant record. Method: PUT",
  inputs: {
    required: ["membername", "challenge_id", "fields"],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "a0AK000000BiJTrMAN"
  },
  version: 2.0,
  run: function(api, connection, mainNext){
    var next = function(data){
      utils.processResponse(data, connection);
      mainNext(connection, true);
    };

    try {
      var fields = JSON.parse(connection.params.fields) || {};
      if (!fields['challengeid'])
        fields['challengeid'] = connection.params.challenge_id;

      var params = [];
      _.each(fields, function(value, key) {
        params[params.length] = {
          key: key,
          value: value
        };
      });
      api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
        api.sfdc.org.apexRest({ uri: 'v.9/participants/' + connection.params.membername, method: 'PUT', urlParams: params }, session.oauth, function(err, res) {
          if (err) { console.error(err); }
          res.Success = Boolean(res.Success);
          next(res);
        });
      });
    } catch(err) {
      next({
        success: false,
        message: "Invalid json in the 'fields' parameter"
      });
    }
  }
};
