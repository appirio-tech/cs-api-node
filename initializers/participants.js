var pg = require('pg').native
  , forcifier = require("forcifier")
  , _ = require("underscore")

exports.participants = function(api, next){

  api.participants = {

    // methods

    /* 
    * Returns a challenge member's status
    *
    * params - { membername, challenge_id }
    *
    * Returns status
    */
    status: function(params, next) {
      api.sfdc.org.apexRest({ uri: 'v.9/participants/' + params.membername + '?challengeId=' + params.challenge_id + '&fields=id,name,send_discussion_emails__c,score__c,override_submission_upload__c,status__c,place__c,money_awarded__c,has_submission__c,apis__c,paas__c,languages__c,technologies__c,submission_overview__c,challenge__r.name,challenge__r.challenge_id__c,member__r.name,member__r.valid_submissions__c' }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        next(res);
      });
    },

    /* 
    * Returns a specific participant
    *
    * params - { participant_id }
    *
    * Returns a participant record
    */
    fetch: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, member__c, (select name from member__c where sfid = member__c) as member_name, (select profile_pic__c from member__c where sfid = member__c) as member_profile_pic, (select country__c from member__c where sfid = member__c) as member_country, challenge__c, (select name from challenge__c where sfid = challenge__c) as challenge_name, (select challenge_id__c from challenge__c where sfid = challenge__c) as challenge_id, money_awarded__c, place__c, points_awarded__c, score__c, status__c, has_submission__c, completed_scorecards__c, submitted_date__c, send_discussion_emails__c from challenge_participant__c where sfid = $1";
        client.query(sql, [params.participant_id], function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    /* 
    * Creates a new challenge participant record
    *
    * data - { membername, challenge_id, fields }
    *
    * Returns a status message
    */
    create: function(data, next) {
      api.sfdc.org.apexRest({ uri: 'v.9/participants', method: 'POST', body: data.fields }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        res.Success = res.Success == "true";
        next(res);
      });
    },

    /* 
    * Updates an existing challenge participant record
    *
    * data - { membername, challenge_id, fields }
    *
    * Returns a participant record
    */
    update: function(data, next) {
      try {
        var fields = JSON.parse(data.fields) || {};
        if (!fields['challengeid'])
          fields['challengeid'] = data.challenge_id;

        var params = [];
        _.each(fields, function(value, key) {
          params[params.length] = {
            key: key,
            value: value
          };
        });
        
        api.sfdc.org.apexRest({ uri: 'v.9/participants/' + data.membername, method: 'PUT', urlParams: params }, api.sfdc.oauth, function(err, res) {
          if (err) { console.error(err); }
          res.Success = Boolean(res.Success);
          next(res);
        });
      } catch(err) {
        next({
          success: false,
          message: "Invalid json in the 'fields' parameter"
        });
      }
    }
  }
  next();
}
