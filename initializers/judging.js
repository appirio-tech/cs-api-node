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
      var query = "select id, challenge_id__c, name, status__c, number_of_reviewers__c, " +
      "end_date__c, review_date__c, " +
      "(select display_name__c from challenge_categories__r), " +
      "(select name__c from challenge_platforms__r), " +
      "(select name__c from challenge_technologies__r) " +
      "from Challenge__c where community_judging__c = true and status__c IN ('Open for Submissions','Review') " +
      "and number_of_reviewers__c < 3 order by end_date__c";

      api.sfdc.org.query(query, api.sfdc.oauth, function (err, resp) {
        if (!err && resp.records) {
          next(resp.records);
        }
      });
    },

    //An object that has all the scorecard-related initializers
    scorecard: {

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

        var url = "v1/members/" + membername + "/outstandingscorecards";
        api.sfdc.org.apexRest({uri: url, method: "GET"}, api.sfdc.oauth, function (err, resp) {
          if (!err && resp) {
            resp = removeAttributes(resp);
            next(resp);
          }
        });
      }
    },
    
    /*
    * Adds a member as a judge to a challenge
    *
    * params - { membername, challenge_id }
    *
    * Returns a status message
    */
    create: function(params, next) {
      var body = {
        challenge_id: params.challenge_id,
        memberName: params.membername
      };
      api.sfdc.org.apexRest({ uri: 'v.9/judging', method: 'POST', body: body }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        res.Success = res.Success == "true";
        next(res);
      });
    },
    
    /*
    * Saves the scorecard for a participant by a judge member
    *
    * params - { id, answers, comments, options }
    *
    * Returns a status message
    */
    update: function(params, next) {
      var params = [
        {
          key: 'participant_id',
          value: params.id
        },
        {
          key: 'answers',
          value: params.answers
        },
        {
          key: 'comments',
          value: params.comments
        },
        {
          key: 'options',
          value: params.options
        }
      ];
      api.sfdc.org.apexRest({ uri: 'v.9/scorecard', method: 'PUT', urlParams: params }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        res.Success = Boolean(res.Success);
        next(res);
      });
    }
  }
  next();
}
