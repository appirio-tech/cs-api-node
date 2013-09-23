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

exports.messagesInbox = {
  name: "messagesInbox",
  description: "Fetches all messages from a member's inbox. Use the /messages/:id endpoint to retrieve every message's body. Method: GET",
  inputs: {
    required: ['membername'],
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
    "to_profile_pic": "http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg",
    "from_id": "a0IK0000007SVSeMAO",
    "from_name": "chang",
    "from_profile_pic": "http://cs-public.s3.amazonaws.com/default_cs_member_image.png",
    "subject": "hi",
    "status_from": "Read",
    "status_to": "Read",
    "replies": 0
  },
  version: 2.0,
  run: function(api, connection, next){
    api.messages.inbox(connection.params.membername, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.messagesTo = {
  name: "messagesTo",
  description: "Fetches all messages sent to a specific user. Use the /messages/:id endpoint to retrieve every message's body. Method: GET",
  inputs: {
    required: ['membername'],
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
    "to_profile_pic": "http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg",
    "from_id": "a0IK0000007SVSeMAO",
    "from_name": "chang",
    "from_profile_pic": "http://cs-public.s3.amazonaws.com/default_cs_member_image.png",
    "subject": "hi",
    "status_from": "Read",
    "status_to": "Read",
    "replies": 0
  },
  version: 2.0,
  run: function(api, connection, next){
    api.messages.to(connection.params.membername, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.messagesFrom = {
  name: "messagesFrom",
  description: "Fetches all messages sent by a specific user. Use the /messages/:id endpoint to retrieve every message's body. Method: GET",
  inputs: {
    required: ['membername'],
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
    "to_profile_pic": "http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg",
    "from_id": "a0IK0000007SVSeMAO",
    "from_name": "chang",
    "from_profile_pic": "http://cs-public.s3.amazonaws.com/default_cs_member_image.png",
    "subject": "hi",
    "status_from": "Read",
    "status_to": "Read",
    "replies": 0
  },
  version: 2.0,
  run: function(api, connection, next){
    api.messages.from(connection.params.membername, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.messagesCreate = {
  name: "messagesCreate",
  description: "Creates a new message. Method: POST",
  inputs: {
    required: ['to', 'from', 'subject', 'body'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": "true",
    "message": "Notification successfully sent."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.messages.create(connection.params, function(data){
      utils.processResponse(data, connection);
      connection.rawConnection.responseHttpCode = 201;  
      next(connection, true);
    });
  }
};
