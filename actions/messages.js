var utils = require("../utils")

exports.action = {
  name: "messagesFetch",
  description: "Fetches a specific message. Method: GET",
  inputs: {
    required: ['id'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "id": "a1FK0000004Ey9xMAC",
    "name": "PVTM-1925",
    "created_date": "2013-08-03T01:27:58.000Z",
    "last_modified_date": "2013-08-17T09:32:08.000Z",
    "to_id": "a0IK0000007NIQmMAO",
    "to_name": "jeffdonthemic",
    "from_id": "a0IK0000007SVSeMAO",
    "from_name": "chang",
    "subject": "hi",
    "status_from": "Read",
    "status_to": "Read",
    "replies": 0,
    "text": [
      {
        "created_date": "2013-08-03T01:27:58.000Z",
        "last_modified_date": "2013-08-03T01:27:58.000Z",
        "body": "hello"
      }
    ]
  },
  version: 2.0,
  run: function(api, connection, next){
    api.messages.fetch(connection.params.id, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};
