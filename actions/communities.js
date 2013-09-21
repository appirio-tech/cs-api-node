var utils = require("../utils")

exports.action = {
  name: "communitiesList",
  description: "Fetches all communities. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: [
    {
      "name": "Public",
      "community_id": "public",
      "about": "public",
      "members": 0
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    api.communities.list(function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};
