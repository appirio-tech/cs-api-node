exports.challenges = function(api, next){

  api.challenges = {

    // methods

    /*
    * Returns a specific challenge from apex rest service
    *
    * Returns an object with keys name, id, attributes, challenge_reviewers__r,
    * challenge_comment_notifiers__r and asserts__r
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

    participants: {
      /*
      * Return a specific challenge's participants from apex rest service
      */
      list: function (challenge_id, next) {
        var org = api.sfdc.org, oauth = api.sfdc.oauth;

        var url = "v.9/participants?challengeid=" + challenge_id;

        var params = [];
        var fields = "Member__r.Profile_Pic__c,Member__r.Name,Member__r.Total_Wins__c,Member__r.Total_Money__c,Member__r.Country__c,Member__r.summary_bio__c,Status__c,has_submission__c";
        params.push({key: 'fields', value: fields});
        params.push({key: 'limit', value: 250});
        params.push({key: 'orderby', value: 'member__r.name'});

        org.apexRest({uri: url, method: "GET", urlParams: params}, oauth, function (err, resp) {
          if (!err && resp) {
            next(resp);
          }
        });
      }
    }
  }
  next();
}