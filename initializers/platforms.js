var pg = require('pg').native;

exports.platforms = function(api, next){

  api.platforms = {

    // methods

    /*
    * Returns all platforms from pg
    *
    * Returns a collection of platform records
    */
    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select name from platform__c where active__c = true order by name";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }
  }
  next();
}