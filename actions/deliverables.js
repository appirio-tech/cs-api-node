var utils = require("../utils")

exports.action = {
  name: "deliverablesList",
  description: "Fetches all deliverables for a specific challenge participant. Method: GET",
  inputs: {
    required: ['membername', 'challenge_id'],
    optional: [],
  },
  authenticated: false,
  outputExample: [
    {
      "id": "a1LK0000001GHSIMA4",
      "type": "Code",
      "comments": "test",
      "username": null,
      "password": null,
      "language": "Apex",
      "url": "https://s3.amazonaws.com/cs-sandbox/challenges/22/jeffdonthemic/builder.png",
      "hosting_platform": "Salesforce.com"
    },
    {
      "id": "a1LK0000001GHT1MAO",
      "type": "Code",
      "comments": null,
      "username": null,
      "password": null,
      "language": "Apex",
      "url": "https://s3.amazonaws.com/cs-sandbox/challenges/22/jeffdonthemic/builder.png",
      "hosting_platform": "Salesforce.com"
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.list(connection.params, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};
