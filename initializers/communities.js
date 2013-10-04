var pg = require('pg').native

exports.communities = function(api, next){

  api.communities = {

    // methods

    /* 
    * Returns all communities from pg
    *
    * Returns a collection of community records
    */
    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select name, community_id__c, about__c, members__c from community__c order by name";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    /* 
    * Returns a specific community by id from the apex rest service
    *
    * id - the id for the community
    *
    * Returns a community record if it exists
    */
    fetch: function(id, next) {
      api.sfdc.org.apexRest({ uri: 'v.9/communities/' + id }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        next([res]);
      });
    },

    /* 
    * Adds a member to a community
    *
    * params - { membername, community_id }
    *
    * Returns a status message
    */
    addMember: function(params, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var timestamp = new Date().toISOString();
        var sql = "select id from member__c where name = $1";
        client.query(sql, [params.membername], function(err, rs) {
          if (!err) {
            if (rs.rows.length > 0) {
              rs = {
                success: true,
                message: "Member already added."
              }
              next(rs);
            } else {
              var timestamp = new Date().toISOString();
              sql = "insert into community_member__c (username__c, name, lastmodifieddate, createddate, community__c, isdeleted, user__c) values ((select username__c from member__c where name = $1), $1, $2, $2, (select sfid from community__c where community_id__c = $3), false, (select sfid from member__c where name = $1))";
              client.query(sql, [params.membername, timestamp, params.community_id], function(err, rs) {
                if (!err) {
                  rs = {
                    success: true,
                    message: "Member added successfully."
                  }
                } else {
                  rs = {
                    success: false,
                    message: "Member not added."
                  }
                  console.log(err);
                }
                next(rs);
              })
            }
          } else {
            rs = {
              success: false,
              message: "Member not added."
            }
            console.log(err);
            next(rs);
          }
        })
      })
    }
  }
  next();
}
