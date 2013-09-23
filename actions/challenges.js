var utils = require("../utils");

exports.challengesFetch = {
  name: "challengesFetch",
  description: "Fetches a specific challenge. Method: GET",
  inputs: {
    required: ["challenge_id"],
    optional: ["admin"],
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
    api.challenges.fetch(connection.params.challenge_id, connection.params.admin, function(data){
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