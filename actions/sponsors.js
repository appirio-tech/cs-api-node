var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore")

exports.sponsorsList = {
  name: "sponsorsList",
  description: "Fetches all sponsors. Method: GET",
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
  description: "Fetches a specific sponsor. Method: GET",
  inputs: {
    required: ['id'],
    optional: [],
  },
  authenticated: false,
  outputExample: { id: "001K000000f8R8aIAE", name: "Appirio", can_admin_challenges: true, funds_available: 0, logo: "http://cs-public.s3.amazonaws.com/sponsor-logos/appirio-logo.png" },
  version: 2.0,
  run: function(api, connection, next){
    api.sponsors.fetch(connection.params.id, function(data){
      utils.processResponse(data, connection);
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};