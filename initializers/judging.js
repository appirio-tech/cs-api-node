var _ = require("underscore");

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
    },

    //An object that has all the scorecard-related initializers
    scorecard: {
      // methods

      /*
      * Returns a specific scorecard from apex rest service
      */

      fetch: function (participant_id, judge_membername, next) {

       var url = 'v.9/scorecard/' + participant_id;

        var params = [{key: 'reviewer', value: judge_membername}];
        api.sfdc.org.apexRest({uri: url, method: 'GET', urlParams: params}, api.sfdc.oauth, function (err, resp) {
          if (resp) {
            next(resp[_.first(_.keys(resp))]);
          }
        });
      }
    },

    outstanding: {
      /*
      * Returns all challenges that member needs to judge
      *
      * Returns a collection of challenge records
      */
      fetch: function (membername, next) {
        function removeAttributes(data) {
          var fixed = _.isArray(data) ? [] : {};
          for (key in data) {
            if (key === 'attributes') continue;

            if (_.isObject(data[key])) {
              if (_.isArray(data)) {
                fixed.push(removeAttributes(data[key]));
              } else {
                fixed[key] = removeAttributes(data[key]);
              }
            } else {
              fixed[key] = data[key];
            }
          }
          return fixed;
        }

        var org   = api.sfdc.org,
            oauth = api.sfdc.oauth;

        var url = "v1/members/" + membername + "/outstandingscorecards";

        org.apexRest({uri: url, method: "GET"}, oauth, function (err, resp) {
          if (!err && resp) {
            resp = removeAttributes(resp);
            next(resp);
          }
        });
      }
    }
  }
  next();
}
