var pg = require('pg').native

exports.deliverables = function(api, next){

  api.deliverables = {

    // methods

    /* 
    * Returns all deliverables for a challenge participant from pg
    *
    * params - { membername, challenge_id }
    *
    * Returns a collection of deliverables
    */
    list: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, type__c, comments__c, username__c, password__c, language__c, url__c, hosting_platform__c from submission_deliverable__c where deleted__c = false and (select name from member__c where sfid = (select member__c from challenge_participant__c where sfid = challenge_participant__c)) = '" + params.membername + "' and (select challenge_id__c from challenge__c where sfid = (select challenge__c from challenge_participant__c where sfid = challenge_participant__c)) = '" + params.challenge_id + "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },
    /* 
    * Returns a member's submissions for a specific challenge from pg
    *
    * params - { membername, challenge_id }
    *
    * Returns a collection of submissions
    */
    current_submissions: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid from challenge_participant__c where member__c = (select sfid from member__c where name = '" + params.membername + "') and challenge__c = (select sfid from challenge__c where challenge_id__c = '" + params.challenge_id +"')";
        client.query(sql, function(err, rs) {
          if (!rs['rows'] || !rs['rows'][0]) { next([]); }
          else {
            var id = rs.rows[0].sfid;
            api.sfdc.org.apexRest({ uri: 'v.9/submissions?participantid=' + id }, api.sfdc.oauth, function(err, res) {
              if (err) { console.error(err); }
              next(res);
            });
          }
        })
      })
    },

    /* 
    * Return a specific submission from pg
    *
    * params - { membername, challenge_id, submission_id }
    *
    * Returns a submission record
    */
    fetch: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, comments__c, type__c, url__c, username__c, language__c from challenge_submission__c where sfid = '" + params.submission_id + "' and username__c = '" + params.membername + "' and challenge__c = (select sfid from challenge__c where id = '" + params.challenge_id + "')";
        client.query(sql, function(err, res) {
          next(res['rows']);
        })
      })
    }
  }
  next();
}
