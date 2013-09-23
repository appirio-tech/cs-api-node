var utils = require("../utils");

exports.action = {
  name: "challengesFetch",
  description: "Fetches a specific challenge. Method: GET",
  inputs: {
    required: ["challenge_id"],
    optional: ["admin"],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    api.challenges.fetch(connection.params.challenge_id, connection.params.admin, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};