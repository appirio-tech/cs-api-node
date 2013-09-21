var pg = require('pg').native;

exports.categories = function(api, next){

  api.categories = {

    // methods

    /*
    * Returns all categories from pg
    *
    * Returns a collection of category records
    */
    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select name from category__c order by name";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }
  }
  next();
}