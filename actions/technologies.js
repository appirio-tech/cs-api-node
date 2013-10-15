var _ = require("underscore")
var pg = require('pg').native;

exports.action = {
  name: "technologiesList",
  description: "Fetches all technologies. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: ["JavaScript", "jQuery", "Node.js", "Other", "Python", "Redis", "Ruby"],
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select name from technology__c where active__c = true order by name";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        connection.response.response = _.pluck(data, 'name');
        connection.response.count = data.length;
        next(connection, true);
      });
    });
  }
};