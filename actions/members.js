var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore")  

exports.membersList = {
  name: "membersList",
  description: "Fetches all members. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    api.members.list(function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.membersFetch = {
  name: "membersFetch",
  description: "Fetches a specific member. Method: GET",
  inputs: {
    required: ['membername'],
    optional: ['fields'],
  },
  authenticated: false,
  outputExample: { id: "a0IK0000007NIQmMAO", name: "jeffdonthemic"},
  version: 2.0,
  run: function(api, connection, next){
    // enforce the pass list of field or if null, use the default member list of fields
    var fields =  connection.params.fields != null ? forcifier.enforceList(connection.params.fields) : api.configData.defaults.memberFields;
    api.members.fetch(connection.params.membername, fields, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.membersUpdate = {
  name: "membersUpdate",
  description: "Updates a specific member. Method: PUT",
  inputs: {
  	// fields must be in form of serialized JSON...
    required: ['membername', 'fields'],
    optional: []
  },
  authenticated: true,
  outputExample: { success: true },
  version: 2.0,
  run: function(api, connection, next){
  	var fields;
  	// process fields as a stringified JSON object...
  	try {
  		fields = JSON.parse(connection.params.fields);
  		// TODO: filter fields with white-listed ones!
		
		api.members.update(connection.params.membername, fields, function(data){
			connection.response.response = data;
			next(connection, true);
		});
  	}
  	catch( error )
  	{
  		// TODO: proper error creation!
  		next(connection, true);
  	}
  	next(connection, true);
  }
};
