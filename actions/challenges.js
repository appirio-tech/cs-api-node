var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore");

exports.challengesList = {
  name: "challengesList",
  description: "Fetches all open challenges. Method: GET",
  inputs: {
    required: [],
    optional: ["open", "technology", "platform", "category", "order_by", "limit", "offset"]
  },
  authenticated: false,
  outputExample: {
    attributes: {
      type: "Challenge__c",
      url: "/services/data/v22.0/sobjects/Challenge__c/a0GK0000008OIRAMA4"
    },
    name: "Test for Lazybaer",
    id: "a0GK0000008OIRAMA4"
  },
  version: 2.0,
  run: function(api, connection, next){
    var options = _.pick(connection.params, "open", "technology", "platform", "category", "order_by", "limit", "offset");
    api.challenges.list(options, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.challengesParticipantsList = {
  name: "challengesParticipantsList",
  description: "Fetches a specific challenge's participants. Method: GET",
  inputs: {
    required: ["challenge_id"],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    api.challenges.participants.list(connection.params.challenge_id, function(data){
      utils.processResponse(data, connection, false);
      next(connection, true);
    });
  }
};

exports.challengesFetch = {
    name: "challengesFetch",
    description: "Searches for a challenge by keyword. Method: GET",
    inputs: {
        required: [],
        optional: []
    },
    authenticated: false,
    outputExample: {},
    version: 2.0,
    run: function(api, connection, next){
        // enforce the pass list of field or if null, use the default member list of fields
        var fields =  connection.params.fields != null ? forcifier.enforceList(connection.params.fields) : api.configData.defaults.memberFields;
        api.members.search (connection.params.keyword, fields, function(data){
            utils.processResponse(data, connection);
            next(connection, true);
        });
    }
};

exports.challengesScorecards = {
  name: "challengesScorecards",
  description: "Fetches all scorecards for a challenge. Method: GET",
  inputs: {
    required: ["id"],
    optional: []
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next) {
    api.challenges.scorecards(connection.params.id.trim(), function(data) {
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.challengesScorecard = {
  name: "challengesScorecard",
  description: "Fetches scorecard of a challenge. Method: GET",
  inputs: {
    required: ["id"],
    optional: []
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next) {
    api.challenges.scorecard(connection.params.id.trim(), function(data) {
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};
