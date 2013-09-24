var pg = require('pg').native
  , utils = require("../utils")
  , _ = require("underscore")
  , querystring = require("querystring");

exports.challenges = function(api, next){

  api.challenges = {

    // methods

    /*
    * Returns all challenges from from sfdc
    *
    * options - the keyword used in the search
    *   open        : 'true'/'false'
    *   technology  : the technology of challenges to return
    *   platform    : the platform of challenges to return
    *   category    : the category of challenges to return
    *   order_by    : the field to order the results by. Defaults 'end_date'
    *   limit       : Default 100
    *   offset      : Default 0 
    * 
    * Returns a collection of challenge records
    */

    list: function(options, next) {
      console.log(options)

      var params = _.pick(options, "open", "technology", "platform", "category", "limit", "offset");
      params.open = options.open || 'true';
      params.orderby = utils.enforceOrderByParam(options.order_by, 'end_date__c');
      params.fields = 'Id,Challenge_Id__c,Name,Description__c,Total_Prize_Money__c,Challenge_Type__c,Days_till_Close__c,Registered_Members__c,Participating_Members__c,Start_Date__c,End_Date__c,Is_Open__c,Community__r.Name,Community__r.Community_Id__c';

      api.sfdc.org.apexRest({ uri: 'v.9/challengeslist?' + querystring.stringify(params) }, api.sfdc.oauth, function(err, res) {
        if (err) { console.log(err); return next(err); }

        next(res);
      });
    },    

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