var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore")  

exports.membersList = {
  name: "membersList",
  description: "Fetches all members",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    api.members.list(function(data){
      connection.response.response = _.values(forcifier.deforceJson(data));
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.membersFetch = {
  name: "membersFetch",
  description: "Fetches a specific member",
  inputs: {
    required: ['membername'],
    optional: ['fields'],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    // enforce the pass list of field or if null, use the default member list of fields
    var fields =  connection.params.fields != null ? forcifier.enforceList(connection.params.fields) : api.configData.defaults.memberFields;
    api.members.fetch(connection.params.membername, fields, function(data){
      utils.processResponse(data, connection);
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};