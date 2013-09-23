var pg = require('pg').native;
var utils = require("../utils");
var _ = require("underscore");
var querystring = require("querystring");
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
    }

  }
  next();
};