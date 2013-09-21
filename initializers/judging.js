exports.judging = function(api, next){

  api.judging = {

    // methods

    /*
    * Returns all challenges that need judging from database
    *
    * Returns a collection of challenge records
    */
    list: function(next) {
      var org   = api.sfdc.org,
          oauth = api.sfdc.oauth;

      var query = "select id, challenge_id__c, name, status__c, number_of_reviewers__c, " +
      "end_date__c, review_date__c, " +
      "(select display_name__c from challenge_categories__r), " +
      "(select name__c from challenge_platforms__r), " +
      "(select name__c from challenge_technologies__r) " +
      "from Challenge__c where community_judging__c = true and status__c IN ('Open for Submissions','Review') " +
      "and number_of_reviewers__c < 3 order by end_date__c";

      org.query(query, oauth, function (err, resp) {
        if (!err && resp.records) {
          next(resp.records);
        }
      });
    }
  }
  next();
}