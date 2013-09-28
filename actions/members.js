var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore")
  , configData = require("../config").configData;

exports.membersList = {
  name: "membersList",
  description: "Fetches all members. Method: GET",
  inputs: {
    required: [],
    optional: []
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
    optional: ['fields']
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
  // returns the updated fields with their new values...
  outputExample: { "jabber":"new jabber for me", "school": "higher education" },
  version: 2.0,
  run: function(api, connection, next){
  	// process fields as a stringified JSON object...
  	try {
  		var fields = JSON.parse(connection.params.fields);
  		
  		// validate email, if found...
  		var pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  		if( _.has(fields, 'email') && !pattern.test(fields.email) )
  		{
  			// this error will be catched below...
  			throw new Error('Invalid email.');
  		}
  		
		fields =  forcifier.enforceJson(fields);
		
		// filter fields to white-listed ones...
		fields = _.pick(fields, configData.whiteList.memberUpdate);
		
		if( _.size(fields) > 0 )
		{
			api.members.update(connection.params.membername, fields, function(data){
				utils.processResponse(data, connection);
				next(connection, true);
			});
		} else {
			// save an extra call, if no update-able fields are present...
			utils.processResponse({}, connection);
			next(connection, true);
		}
  	}
  	catch( error )
  	{
  		// send the parsing error back to the client...
  		connection.error = error;
  		next(connection, true);
  	}
  }
};

exports.membersPayments = {
  name: "membersPayments",
  description: "Fetches payments of a specific member. Method: GET",
  inputs: {
    required: ['membername'],
    optional: ['fields', 'order_by'],
  },
  authenticated: false,
  outputExample: [
    {
        "id": "a0bU00000078I02IAE",
        "name": "PAY-2587",
        "challenge__name": "Leaderboard with Rails and Redis",
        "challenge_id": "1544",
        "money": 750,
        "place": "1",
        "reason": "Contest payment",
        "status": "Paid",
        "type": null,
        "reference_number": "5B186853UD6413645",
        "payment_sent": "2012-07-23"
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    // enforce the pass list of field or if null, use the default payments list of fields
    var fields =  connection.params.fields != null ? forcifier.enforceList(connection.params.fields) : api.configData.defaults.paymentFields;
    var orderBy =  connection.params.order_by || "id";
    api.members.payments(connection.params.membername, fields, orderBy, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.membersChallenges = {
  name: "membersChallenges",
  description: "Fetches a specific member's challenges. Method: GET",
  inputs: {
    required: ['membername'],
    optional: [],
  },
  authenticated: false,
  outputExample: { "active": { "0" : { "id": "2885", "name": "Port the CloudSpokes API to Node.js", "challenge_type" : "Code", "top_prize": "100" } } },
  version: 2.0,
  run: function(api, connection, next){
    api.members.challenges(connection.params.membername, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.membersPastChallenges = {
  name: "membersPastChallenges",
  description: "Fetches a specific member's past challenges. Method: GET",
  inputs: {
    required: ['membername'],
    optional: [],
  },
  authenticated: false,
  outputExample: { "records": { "0" : { "id": "2885", "name": "Port the CloudSpokes API to Node.js", "challenge_type" : "Code", "top_prize": "100" } } },
  version: 2.0,
  run: function(api, connection, next){
    api.members.pastChallenges(connection.params.membername, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};


exports.membersReferrals = {
  name: "membersReferrals",
  description: "Fetches referrals of a specific member. Method: GET",
  inputs: {
    required: ['membername'],
    optional: [],
  },
  authenticated: false,
  outputExample: [
    {
        "signup_date": "2013-01-07T20:58:48.000Z",
        "referral_money": 0,
        "referral_id": "a11U0000000UpzSIAS",
        "profile_pic": "http://res.cloudinary.com/hnep56ea0/image/upload/c_fill,h_125,w_125/timhicks24.jpg",
        "membername": "timhicks24",
        "first_year_money": 0
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    api.members.referrals(connection.params.membername, function(data){
      utils.processResponse(data, connection, false);
      next(connection, true);
    });
  }
};

exports.membersSearch = {
    name: "membersSearch",
    description: "Searches for a member by keyword. Method: GET",
    inputs: {
        required: ['keyword'],
        optional: ['fields']
    },
    authenticated: false,
    outputExample: { id: "a0IK0000007NIQmMAO", name: "jeffdonthemic"},
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
