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

exports.challengesListSubmissions = {
  name: "challengesListSubmissions",
  description: "Returns a collection of submissions for a challenge. Method: GET",
  inputs: {
    required: ["challenge_id"],
    optional: [],
  },
  authenticated: false,
  outputExample: [
    {
      "attributes": {
        "type": "Challenge_Submission__c",
        "url": "/services/data/v22.0/sobjects/Challenge_Submission__c/a0DK00000095XjUMAU"
      },
      "challenge__r": {
        "attributes": {
          "type": "Challenge__c",
          "url": "/services/data/v22.0/sobjects/Challenge__c/a0GK0000006k4wjMAA"
        },
        "name": "First2Finish - Test Upload",
        "id": "a0GK0000006k4wjMAA"
      },
      "challenge_participant": "a0AK000000AqiApMAJ",
      "name": "CS-29673",
      "challenge_participant__r": {
        "attributes": {
          "type": "Challenge_Participant__c",
          "url": "/services/data/v22.0/sobjects/Challenge_Participant__c/a0AK000000AqiApMAJ"
        },
        "id": "a0AK000000AqiApMAJ"
      },
      "url": "https://s3.amazonaws.com/cs-sandbox/challenges/22/jeffdonthemic/builder.png",
      "comments": "test",
      "type": "Code",
      "id": "a0DK00000095XjUMAU",
      "username": "jeffdonthemic",
      "challenge": "a0GK0000006k4wjMAA"
    },
    {
      "attributes": {
        "type": "Challenge_Submission__c",
        "url": "/services/data/v22.0/sobjects/Challenge_Submission__c/a0DK00000095SSXMA2"
      },
      "challenge__r": {
        "attributes": {
          "type": "Challenge__c",
          "url": "/services/data/v22.0/sobjects/Challenge__c/a0GK0000006k4wjMAA"
        },
        "name": "First2Finish - Test Upload",
        "id": "a0GK0000006k4wjMAA"
      },
      "challenge_participant": "a0AK000000AqUBnMAN",
      "name": "CS-29584",
      "challenge_participant__r": {
        "attributes": {
          "type": "Challenge_Participant__c",
          "url": "/services/data/v22.0/sobjects/Challenge_Participant__c/a0AK000000AqUBnMAN"
        },
        "id": "a0AK000000AqUBnMAN"
      },
      "url": "http://www.google.com",
      "type": "URL",
      "id": "a0DK00000095SSXMA2",
      "username": "salpartovi",
      "challenge": "a0GK0000006k4wjMAA"
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    api.challenges.listSubmissions(connection.params.challenge_id, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.challengesComments = {
  name: "challengesComments",
  description: "Fetches all comments for a challenge. Method: GET",
  inputs: {
    required: ["id"],
    optional: []
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
  api.challenges.comments(connection.params.id.trim(), function(data){
    utils.processResponse(data, connection);
    next(connection, true);
  });
  }
};
