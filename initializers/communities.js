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
    }
  }
  next();
}
