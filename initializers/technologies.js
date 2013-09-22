var pg = require('pg').native;

exports.technologies = function(api, next){

  api.technologies = {

    // methods

    /*
    * Returns all technologies from pg
    *
    * Returns a collection of technology records
    */
    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select name from technology__c where active__c = true order by name";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }
  }
  next();
}