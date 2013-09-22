var _ = require("underscore")

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
    api.platforms.list(function(data){
      connection.response.response = _.pluck(data, 'name');
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};