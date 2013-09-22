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
      "name": "Another Community",
      "community_id": "1more",
      "about": "This my test community.",
      "members": 2
    },
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

exports.communitiesFetch = {
  name: "communitiesFetch",
  description: "Fetches a specific community. Method: GET",
  inputs: {
    required: ['id'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "leaderboard": [],
    "community": {
      "attributes": {
        "type": "Community__c",
        "url": "/services/data/v24.0/sobjects/Community__c/a12K0000001F6ipIAC"
      },
      "name": "Public",
      "email_domain": "no domain",
      "id": "a12K0000001F6ipIAC",
      "about": "public",
      "public_group": "All Members",
      "members": 0
    },
    "challenges": []
  },
  version: 2.0,
  run: function(api, connection, next){
    api.communities.fetch(connection.params.id, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};
