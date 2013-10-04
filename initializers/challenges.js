var pg = require('pg').native
  , utils = require("../utils")
  , _ = require("underscore")
  , querystring = require("querystring")
  , forcifier = require("forcifier")
  , request = require('request');

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
    * Returns all recently closed challenges with selected winners
    *
    * options - the keyword used in the search
    *   technology  : the technology of challenges to return
    *   platform    : the platform of challenges to return
    *   category    : the category of challenges to return
    *   limit       : Default 100
    *   offset      : Default 0
    *
    * Returns a collection of challenge records
    */
    recent: function(options, next) {
      var org   = api.sfdc.org;
      var oauth = api.sfdc.oauth;

      var query_where = '';
      if (options.platform)
        query_where = query_where + " and id in (select challenge__c from challenge_platform__c where name__c = '" + options.platform + "') ";
      if (options.technology)
        query_where = query_where + " and id in (select challenge__c from challenge_technology__c where name__c = '" + options.technology + "') ";
      if (options.category)
        query_where = query_where + " and challenge_type__c = '" + options.category + "' ";
      var query = "SELECT Blog_URL__c, Blogged__c, Auto_Blog_URL__c, Name, challenge_type__c, Description__c, End_Date__c, Challenge_Id__c, License_Type__r.Name, Source_Code_URL__c, " +
          "Total_Prize_Money__c, Top_Prize__c,registered_members__c, participating_members__c, (SELECT Money_Awarded__c,Place__c,Member__c, " +
          "Member__r.Name, Points_Awarded__c,Score__c,Status__c FROM Challenge_Participants__r where Has_Submission__c = true), " +
          "(Select Name, Category__c, Display_Name__c From Challenge_Categories__r), (Select name__c From Challenge_Platforms__r), " +
          "(Select name__c From Challenge_Technologies__r), platforms__c, technologies__c " +
          "FROM Challenge__c where Status__c = 'Winner Selected' " + query_where + " Order By End_Date__c DESC LIMIT " + options.limit + " OFFSET " + options.offset;

      org.query(query, oauth, function (err, resp) {
        if (!err && resp.records) {
          next(resp.records);
        }
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
    },

    scorecards: function(id, next) {

      api.sfdc.org.apexRest({
        uri: 'v.9/challenges/' + id + "/scorecards?fields=id,name,member__r.name,member__r.profile_pic__c,member__r.country__c,challenge__c,money_awarded__c,prize_awarded__c,place__c,score__c,submitted_date__c"
      }, api.sfdc.oauth, function(err, res) {
        if (err) {
          console.log(err);
          return next(err);
        }

        next(res);
      });
    },

    /*
     * Returns scorecard of a challenges from from sfdc
     *
     * id - challenge id
     *
     * Returns a collection of scorecard records
     */

    scorecard: function(id, next) {
      api.sfdc.org.apexRest({
        uri: 'v.9/scorecard/' + id + "/questions"
      }, api.sfdc.oauth, function(err, res) {
        if (err) {
          console.log(err);
          return next(err);
        }

        next(res);
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
    } ,

    /*
     * Returns all comments of a challenges from from sfdc
     *
     * id - challenge id
     *
     * Returns a collection of comments records
     */

    comments: function(id, next) {
      api.sfdc.org.apexRest({uri: 'v.9/comments/' + id}, api.sfdc.oauth, function(err, res) {
        if (err) {
          console.log(err);
          return next(err);
        }

        next(res);
      });
    },

    /*
    * Creates a survey in salesforce.com for a challenge
    *
    * data - hash of values containing survey responses
    *
    * Returns JSON containing the keys: success, message
    */
    surveyInsert: function(data, next) {
      var message = 'Survey entry added successfully';
      var client = new pg.Client(api.configData.pg.connString);
      client.connect( function(err) {
        if ( handleError(err, next) ) { return; }
        findByChallengeId( data.challenge_id, function(err, challenge) {
          if ( handleError(err, next) ) { return; }
          client.query(
            ' INSERT INTO survey__c (challenge__c, compete_again__c, prize_money__c, requirements__c, timeframe__c, why_no_submission__c, improvements__c) ' +
            '      VALUES ($1, $2, $3, $4, $5, $6, $7) ',
            [challenge.sfid, data.compete_again, data.prize_money, data.requirements, data.timeframe, data.why_no_submission, data.improvements],
            function(err, result) {
              if ( handleError(err, next) ) { return; }
              next( null, {success: true, message: message} );
            }
          );
        });
      })
    },

    /*
    * Creates a new discussion board comment for the challenge
    *
    * data - the JSON to use to create the comment
    *
    * Returns JSON containing the following keys: success, errors
    */
    commentInsert: function(data, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect( function(err) {
        if ( handleError(err, next) ) { return; }
        findByChallengeId( data.challenge_id, function(err, challenge) {
          if ( handleError(err, next) ) { return; }
      var postdata = 'username='+encodeURIComponent(data.membername)+'&challenge='+encodeURIComponent(data.challenge_id)+'&comment='+encodeURIComponent(data.comments)+'&replyto='+(data.reply_to?encodeURIComponent(data.reply_to):'')+'';
      api.sfdc.org.apexRest( {uri: 'v.9/comments', method: 'POST', body: postdata}, api.sfdc.oauth, function( err, result ) {
              var success = result.Success === 'true';
        if ( handleError(err, next) ) { return; }
              var err = (success) ? null : new Error(result.Message);
        next( err, {success: success, message: result.Message} );
      }
          );
        });
      })
    },

    search: function(keyword, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var query = "select name, status__c, end_date__c, total_prize_money__c," +
            "registered_members__c, challenge_id__c, challenge_type__c, id, start_date__c, participating_members__c, " +
            "description__c, days_till_close__c, platforms__c, technologies__c  from challenge__c where name like '%" +keyword + "%' " +
            "and status__c NOT IN ('hidden','draft') order by name";
        api.sfdc.org.query(query, api.sfdc.oauth, function (err, resp) {
            if (err) { console.log(err); }
            if (!err && resp.records) {
              next(resp.records);
            }
        });
      })
    },

    advsearch: function(requestParams, next) {

        var url = "v.9/advchallengesearch" + requestParams;

        var org   = api.sfdc.org,
            oauth = api.sfdc.oauth;

        org.apexRest({uri: url, method: "GET"}, oauth, function (err, resp) {
            if (!err && resp) {
                next(resp);
            }
        });


    },

    /*
    * Updates an existing challenge
    *
    * params - { challenge_id, data }
    *
    * Returns a status message
    */
    update: function(params, next) {
      var reqData = params.data;
      // Deforce then enforce so that already enforced keys won't be enforced twice
      reqData.challenge = forcifier.enforceJson(forcifier.deforceJson(reqData.challenge));
      api.sfdc.org.apexRest({ uri: 'v1/admin/challenges', method: 'PUT', body: reqData }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        next(res);
      });
    },

    /*
    * Creates a new challenge
    *
    * data - challenge data
    *
    * Returns a status message
    */
    create: function(data, next) {
      try {
        data = JSON.parse(data);
        api.sfdc.org.apexRest({ uri: 'v1/admin/challenges', method: 'POST', body: data }, api.sfdc.oauth, function(err, res) {
          if (err) { console.error(err); }
          next(res);
        });
      } catch(err) {
        next({
          success: false,
          message: "Invalid json in the 'data' parameter"
        });
      }
    }
  }
  next();

  /***********************
  *
  * PRIVATE FUNCTIONS
  *
  ************************/

  /*
  * Error handler code to make the coding nicer
  *
  * err - an error that may had happened
  * next - the next handler in the chain
  *
  * Returns true if err is not undefined, false otherwise.
  * If err is not undefined then it is sent to the next handler.
  */
  var handleError = function( err, next ) {
    if ( !err ) return false;
    console.log( err );
    next( err, {success: false, message: JSON.stringify(err.message)} );
    return true;
  };

  /*
  * Finds a challenge info by their challenge id from pg.
  *
  * challengeId - the cs challenge id to find
  *
  * Returns JSON containing the keys: success, id, sfid, ownerid
  * If the member is not found, returns an error 'Challenge not found for badid'.
  */
  var findByChallengeId = function (challengeId, next) {
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) {
        next(err);
        return;
      }
      var sql = "select * from challenge__c where challenge_id__c = $1 ";
      client.query(sql, [challengeId], function(err, rs) {
        if (rs["rows"].length != 1) {
          var error = new Error("Challenge not found for " + challengeId);
          error.statusCode = 404;
          next(error);
        } else {
          var challenge = {
            success: true,
            id: rs["rows"][0].id,
            sfid: rs["rows"][0].sfid
            //add more data when needed
          }
          next(null, challenge);
        }
      });
    });
  }

}
