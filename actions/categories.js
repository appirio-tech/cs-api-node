var _ = require("underscore")
  , pg = require('pg').native

exports.action = {
  name: "categoriesList",
  description: "Fetches all categories. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: ['Code', 'Design', 'First2Finish'],
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select name from category__c where active__c = true order by name";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        connection.response.response = _.pluck(data, 'name');
        connection.response.count = data.length;
        next(connection, true);
      })
    })
  }
};