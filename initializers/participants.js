var pg = require('pg').native

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
        var sql = "select sfid as id, member__c, (select name from member__c where sfid = member__c) as member_name, (select profile_pic__c from member__c where sfid = member__c) as member_profile_pic, (select country__c from member__c where sfid = member__c) as member_country, challenge__c, (select name from challenge__c where sfid = challenge__c) as challenge_name, (select challenge_id__c from challenge__c where sfid = challenge__c) as challenge_id, money_awarded__c, place__c, points_awarded__c, score__c, status__c, has_submission__c, completed_scorecards__c, submitted_date__c, send_discussion_emails__c from challenge_participant__c where sfid = '" + params.participant_id + "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }
  }
  next();
}
