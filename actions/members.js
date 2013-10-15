var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore")
  , configData = require("../config").configData
  , pg = require('pg').native

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
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select id, sfid, name, email__c from member__c limit 5";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false});
        next(connection, true);
      })
    })
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
    var fields =  connection.params.fields != null ? forcifier.enforceList(connection.params.fields) : api.configData.defaults.memberFields;
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select " + fields+ " from member__c where name = $1";
      client.query(sql, [connection.params.membername], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection);
        next(connection, true);
      })
    })
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
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        
        // construct the string in form of:
        // key1='value1',key2='value2',keyN='valueN'
        
        // chaining with underscore...
        var updates = _.chain(fields)
          // get the pairs in an array as [ key:"value" ]...
          .pairs()
          // map it to [ "key='value'" ]...
          .map(function(field){
            return field[0] + "=\'" + field[1] + "\'";
          })
          // return the value as string...
          .value().toString();
        
        // create the psql statement, defining as return value the fields
        // that are being updated with their new values...
        var sql = "UPDATE member__c SET " + updates + " WHERE name= $1 "
            + "RETURNING " + _.keys(fields).toString() + ";";

          client.query(sql, [connection.params.membername], function(err, rs) {
            var data = rs['rows'];
            utils.processResponse(data, connection);
            next(connection, true);
          });
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
  authenticated: true,
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
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }

      var sql = "select "+ fields +" from payment__c p"
        + " inner join member__c m on p.member__c = m.sfid"
        + " inner join challenge__c c on p.challenge__c = c.sfid"
        + " where m.name = $1 order by " + orderBy;

      client.query(sql, [connection.params.membername], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false, "smartParsing": false});
        next(connection, true);
      })
    })
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
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({ uri: 'v1/members/' + connection.params.membername + '/challenges' }, session.oauth, function(err, res) {
        if (err) { console.error(err); }
        utils.processResponse(res, connection, {"throw404": false});
        next(connection, true);
      });
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
  authenticated: true,
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
    var url = "v.9/referrals/" + escape(membername);
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({uri: url, method: "GET"}, session.oauth, function (err, resp) {
        if(err) { return next(err); }
        utils.processResponse(resp, connection, {throw404: false, smartParsing: false});
        next(connection, true);
      });
    });
  }
};

exports.membersSearch = {
  name: "membersSearch",
  description: "Searches for a member by keyword. Method: GET",
  inputs: {
      required: ['q'],
      optional: ['fields']
  },
  authenticated: false,
  outputExample: { id: "a0IK0000007NIQmMAO", name: "jeffdonthemic"},
  version: 2.0,
  run: function(api, connection, next){
    // enforce the pass list of field or if null, use the default member list of fields
    var fields =  connection.params.fields != null ? forcifier.enforceList(connection.params.fields) : api.configData.defaults.memberFields;
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select " + fields+ " from member__c where name LIKE '" +connection.params.q+ "%'";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false, "smartParsing": false});
        next(connection, true);
      })
    })
  }
};
