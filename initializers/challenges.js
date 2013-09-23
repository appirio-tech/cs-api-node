exports.challenges = function(api, next){

  api.challenges = {

    // methods

    /*
    * Returns a specific challenge from apex rest service
    *
    * TODO: List returned object keys
    */
    fetch: function(challenge_id, for_admin, next) {
      var org = api.sfdc.org, oauth = api.sfdc.oauth;
      var url = "v.9/challenges/" + challenge_id;
      var params = [];
      if (for_admin) params.push({key: 'comments', value: 'true'});
      org.apexRest({uri: url, method: "GET", urlParams: params}, oauth, function (err, resp) {
        if (!err) {
          if (for_admin) {
            delete(resp[0].challenge_participants__r);
            var query = "select id, member__r.name from challenge_reviewer__c " +
              "where challenge__r.challenge_id__c = '" + challenge_id + "'";
            org.query(query, oauth, function (err, data) {
              if (!err) {
                resp[0].challenge_reviewers__r = data.records;
                query = "select id, member__r.name from challenge_comment_notifier__c " +
                  "where challenge__r.challenge_id__c = '" + challenge_id + "'";
                org.query(query, oauth, function (err, data) {
                  resp[0].challenge_comment_notifiers__r = data.records;
                  query = "select id, name, key__c, filename__c from asset__c " +
                    "where challenge__r.challenge_id__c = '" + challenge_id + "'";
                  org.query(query, oauth, function (err, data) {
                    resp[0].assets__r = data.records;
                    // console.log(resp);
                    next(resp);
                  });
                });
              }
            });
          } else {
            next(resp);
          }
        };
      });
    },

    /* 
    * Returns a collection of submissions for a challenge
    *
    * challenge_id - the id of the challenge
    *
    * Returns a collection of submissions
    */
    listSubmissions: function(challenge_id, next) {
      api.sfdc.org.apexRest({ uri: 'v.9/submissions?challengeid=' + challenge_id + '&fields=id,name,challenge__r.name,url__c,comments__c,type__c,username__c,challenge_participant__r.place__c,challenge_participant__c&orderby=username__c' }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        next(res);
      });
    }
  }
  next();
}