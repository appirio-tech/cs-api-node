var request = require('request')
  , pg = require('pg').native
  , _ = require("underscore")

exports.deliverables = function(api, next){

  api.deliverables = {

    // methods

    /* 
    * Returns all deliverables for a challenge participant from pg
    *
    * params - { membername, challenge_id }
    *
    * Returns a collection of deliverables
    */
    list: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, type__c, comments__c, username__c, password__c, language__c, url__c, hosting_platform__c from submission_deliverable__c where deleted__c = false and (select name from member__c where sfid = (select member__c from challenge_participant__c where sfid = challenge_participant__c)) = '" + params.membername + "' and (select challenge_id__c from challenge__c where sfid = (select challenge__c from challenge_participant__c where sfid = challenge_participant__c)) = '" + params.challenge_id + "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },
    /* 
    * Returns a member's submissions for a specific challenge from pg
    *
    * params - { membername, challenge_id }
    *
    * Returns a collection of submissions
    */
    current_submissions: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid from challenge_participant__c where member__c = (select sfid from member__c where name = '" + params.membername + "') and challenge__c = (select sfid from challenge__c where challenge_id__c = '" + params.challenge_id +"')";
        client.query(sql, function(err, rs) {
          if (!rs['rows'] || !rs['rows'][0]) { next([]); }
          else {
            var id = rs.rows[0].sfid;
            api.sfdc.org.apexRest({ uri: 'v.9/submissions?participantid=' + id }, api.sfdc.oauth, function(err, res) {
              if (err) { console.error(err); }
              next(res);
            });
          }
        })
      })
    },

    /* 
    * Return a specific submission from pg
    *
    * params - { membername, challenge_id, submission_id }
    *
    * Returns a submission record
    */
    fetch: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, comments__c, type__c, url__c, username__c, language__c from challenge_submission__c where sfid = '" + params.submission_id + "' and username__c = '" + params.membername + "' and challenge__c = (select sfid from challenge__c where id = '" + params.challenge_id + "')";
        client.query(sql, function(err, res) {
          next(res['rows']);
        })
      })
    },

    /* 
    * Deletes the specified submission
    *
    * params - { membername, challenge_id, submission_id }
    *
    * Returns a status message
    */
    deleteSubmission: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "update challenge_submission__c set deleted__c = true where sfid = '" + params.submission_id + "' and username__c = '" + params.membername + "' and challenge__c = (select sfid from challenge__c where id = '" + params.challenge_id + "')";
        client.query(sql, function(err, res) {
          if (!err) {
            res = {
              success: true,
              message: "Submission removed successfully."
            }
          } else {
            res = {
              success: false,
              message: "Submission couldn't be removed."
            }
          }
          next(res);
        })
      })
    },

    /* 
    * Adds a submission by a member for the specified challenge
    *
    * params - { membername, challenge_id, link, type, language, comments }
    *
    * Returns a status message
    */
    createSubmission: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var timestamp = new Date().toISOString();
        var sql = "select sfid from challenge_participant__c where membername__c = '" + params.membername + "' and challenge__c = (select sfid from challenge__c where id = '" + params.challenge_id + "')";
        client.query(sql, function(err, rs) {
          if (!err) {
            if (rs.rows.length > 0) {
              var timestamp = new Date().toISOString();
              sql = "insert into challenge_submission__c (challenge_participant__c, url__c, type__c, language__c, comments__c, createddate, lastmodifieddate) values ('" + rs.rows[0].sfid + "', '" + params.link + "', '" + params.type + "', '" + params.language + "', '" + params.comments + "', '" + timestamp + "', '" + timestamp + "')";
              client.query(sql, function(err, rs) {
                if (!err) {
                  rs = {
                    success: true,
                    message: "Submission created successfully."
                  }
                } else {
                  rs = {
                    success: false,
                    message: "Error while trying to create submission."
                  }
                  console.log(err);
                }
                next(rs);
              })
            } else {
              rs = {
                success: true,
                message: "Participant not found."
              }
              next(rs);
            }
          } else {
            rs = {
              success: false,
              message: "Error while trying to find member."
            }
            console.log(err);
            next(rs);
          }
        })
      })
    },

    /* 
    * Creates a new deliverable for a participant
    *
    * params - { membername, challenge_id, data }
    *
    * Returns a status message
    */
    create: function(params, next) {
      try {
        var fields = JSON.parse(params.data);
        var client = new pg.Client(api.configData.pg.connString);
        client.connect(function(err) {
          if (err) { console.log(err); }
          var fieldsKeys = '', fieldsValues = '';
          var timestamp = new Date().toISOString();
          fields['createddate'] = fields['lastmodifieddate'] = timestamp;

          _.each(fields, function(value, key) {
            fieldsKeys += ", " + key;
            fieldsValues += ", '" + value + "'";
          });

          // remove ", " from the beginning
          fieldsKeys = fieldsKeys.substring(2);
          fieldsValues = fieldsValues.substring(2);

          sql = "insert into submission_deliverable__c (" + fieldsKeys + ") values (" + fieldsValues + ")";
          client.query(sql, function(err, rs) {
            if (!err) {
              rs = {
                success: true,
                message: "Deliverable created successfully."
              }
            } else {
              rs = {
                success: false,
                message: "Error while trying to create deliverable."
              }
              console.log(err);
            }
            next(rs);
          })
        })
      } catch(err) {
        next({
          success: false,
          message: "Invalid json in the `data` parameter"
        });
      }
    },

    /* 
    * Updates a deliverable for a participant
    *
    * connection.params - { membername, challenge_id, data }
    *
    * Returns a status message
    */
    update: function(connection, next) {
      api.sfdc.org.apexRest({ uri: 'v.9/submissions', method: 'POST', body: connection.params.data }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        res.Success = Boolean(res.Success);
        next(res);
      });
    }
  }
  next();
}
