var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore")

exports.sponsorsList = {
  name: "sponsorsList",
  description: "Fetches all sponsors",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    api.sponsors.list(function(data){
      connection.response.response = _.values(forcifier.deforceJson(data));
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.sponsorsFetch = {
  name: "sponsorsFetch",
  description: "Fetches a specific sponsor",
  inputs: {
    required: ['sfid'],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    api.sponsors.fetch(connection.params.sfid, function(data){
      utils.processResponse(data, connection);
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};