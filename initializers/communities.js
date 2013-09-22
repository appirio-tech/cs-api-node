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
    }
  }
  next();
}
