var _ = require("underscore")
  , pg = require('pg').native;

exports.action = {
  name: "platformsList",
  description: "Fetches all platforms. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: ["AWS", "Cloud Foundry", "Google App Engine", "Heroku", "Salesforce.com"],
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select name from platform__c where active__c = true order by name";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        connection.response.response = _.pluck(data, 'name');
        connection.response.count = data.length;
        next(connection, true);
      })
    })
  }
};