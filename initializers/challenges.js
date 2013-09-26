var pg = require("pg").native;
var request = require('request');

exports.challenges = function(api, next){

  api.challenges = {

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
    }

  } // end api.challenges

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

