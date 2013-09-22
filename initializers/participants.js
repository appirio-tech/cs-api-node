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
    }
  }
  next();
}
