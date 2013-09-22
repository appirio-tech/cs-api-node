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