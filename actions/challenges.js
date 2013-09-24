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
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    var options = _.pick(connection.params, "open", "technology", "platform", "category", "order_by", "limit", "offset");

    api.challenges.list(options, function(data){
      utils.processResponse(data, connection);
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