var forcifier = require("forcifier"),
  utils = require("../utils"),
  _ = require("underscore");

exports.challengesList = {
  name: "challengesList",
  description: "Fetches all open challenges. Method: GET",
  inputs: {
    required: [],
    optional: ["open", "technology", "platform", "category", "order_by", "limit", "offset"]
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next) {
    var options = _.pick(connection.params, "open", "technology", "platform", "category", "order_by", "limit", "offset");

    api.challenges.list(options, function(data) {
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
  run: function(api, connection, next) {
    api.challenges.comments(connection.params.id.trim(), function(data) {
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

