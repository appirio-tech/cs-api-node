var forcifier = require("forcifier")
  , utils = require("../utils")
  , pg = require('pg').native

exports.messagesFetch = {
  name: "messagesFetch",
  description: "Fetches a specific message. Method: GET",
  inputs: {
    required: ['id'],
    optional: [],
  },
  authenticated: true,
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
  run: function(api, connection, mainNext){
    var next = function(data){
      utils.processResponse(data, connection);
      mainNext(connection, true);
    };

    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select sfid as id, name, createddate as created_date, lastmodifieddate as last_modified_date, to__c as to_id, (select name from member__c where sfid = to__c) as to_name, from__c as from_id, (select name from member__c where sfid = from__c) as from_name, subject__c, status_from__c, status_to__c, replies__c from private_message__c where sfid = $1";
      client.query(sql, [connection.params.id], function(err, rs) {
        if (!rs['rows'] || !rs['rows'][0]) { next([]); }
        else {
          var sql2 = "select createddate as created_date, lastmodifieddate as last_modified_date, body__c from private_message_text__c where private_message__c = $1 order by createddate desc";
          client.query(sql2, [connection.params.id], function(err2, rs2) {
            rs['rows'][0].text = rs2['rows'];
            next(rs['rows']);
          })
        }
      })
    })
  }
};

exports.messagesInbox = {
  name: "messagesInbox",
  description: "Fetches all messages from a member's inbox. Use the /messages/:id endpoint to retrieve every message's body. Method: GET",
  inputs: {
    required: ['membername'],
    optional: [],
  },
  authenticated: true,
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
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select sfid as id, name, createddate as created_date, lastmodifieddate as last_modified_date, to__c as to_id, (select name from member__c where sfid = to__c) as to_name, (select profile_pic__c from member__c where sfid = to__c) as to_profile_pic, from__c as from_id, (select name from member__c where sfid = from__c) as from_name, (select profile_pic__c from member__c where sfid = from__c) as from_profile_pic, subject__c, status_from__c, status_to__c, replies__c from private_message__c where to__c = (select sfid from member__c where name = $1) or from__c = (select sfid from member__c where name = $1) order by lastmodifieddate desc";
      client.query(sql, [connection.params.membername], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection);
        next(connection, true);
      })
    })
  }
};

exports.messagesTo = {
  name: "messagesTo",
  description: "Fetches all messages sent to a specific user. Use the /messages/:id endpoint to retrieve every message's body. Method: GET",
  inputs: {
    required: ['membername'],
    optional: [],
  },
  authenticated: true,
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
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select sfid as id, name, createddate as created_date, lastmodifieddate as last_modified_date, to__c as to_id, (select name from member__c where sfid = to__c) as to_name, (select profile_pic__c from member__c where sfid = to__c) as to_profile_pic, from__c as from_id, (select name from member__c where sfid = from__c) as from_name, (select profile_pic__c from member__c where sfid = from__c) as from_profile_pic, subject__c, status_from__c, status_to__c, replies__c from private_message__c where to__c = (select sfid from member__c where name = $1) order by lastmodifieddate desc";
      client.query(sql, [connection.params.membername], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false});
        next(connection, true);
      })
    })
  }
};

exports.messagesFrom = {
  name: "messagesFrom",
  description: "Fetches all messages sent by a specific user. Use the /messages/:id endpoint to retrieve every message's body. Method: GET",
  inputs: {
    required: ['membername'],
    optional: [],
  },
  authenticated: true,
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
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select sfid as id, name, createddate as created_date, lastmodifieddate as last_modified_date, to__c as to_id, (select name from member__c where sfid = to__c) as to_name, (select profile_pic__c from member__c where sfid = to__c) as to_profile_pic, from__c as from_id, (select name from member__c where sfid = from__c) as from_name, (select profile_pic__c from member__c where sfid = from__c) as from_profile_pic, subject__c, status_from__c, status_to__c, replies__c from private_message__c where from__c = (select sfid from member__c where name = $1) order by lastmodifieddate desc";
      client.query(sql, [connection.params.membername], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false});
        next(connection, true);
      })
    })
  }
};

exports.messagesCreate = {
  name: "messagesCreate",
  description: "Creates a new message. Method: POST",
  inputs: {
    required: ['to', 'from', 'subject', 'body'],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "Notification successfully sent."
  },
  version: 2.0,
  run: function(api, connection, mainNext){
    var next = function(data){
      connection.response.response = forcifier.deforceJson(data);
      if (connection.response.response.success)
        connection.rawConnection.responseHttpCode = 201;  
      mainNext(connection, true);
    };

    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select (select sfid from member__c where name = $1) as from_id, (select sfid from member__c where name = $2) as to_id";
      client.query(sql, [connection.params.from, connection.params.to], function(err, rs) {
        if (!rs['rows'][0] || !rs['rows']) { next([]); }
        else {
          var body = {
            fromId: rs.rows[0].from_id,
            toId: rs.rows[0].to_id,
            event: 'Private Message',
            subject: connection.params.subject,
            body: connection.params.body
          };
          api.sfdc.org.apexRest({ uri: 'v.9/notifications', method: 'POST', body: body }, api.sfdc.oauth, function(err, res) {
            if (err) { console.error(err); }
            res.Success = res.Success == "true";
            next(res);
          });
        }
      })
    })
  }
};

exports.messagesReply = {
  name: "messagesReply",
  description: "Reply to a specific private message. Method: POST",
  inputs: {
    required: ['id', 'from', 'body'],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "Notification successfully sent."
  },
  version: 2.0,
  run: function(api, connection, mainNext){
    var next = function(data){
      connection.response.response = forcifier.deforceJson(data);
      if (connection.response.response.success)
        connection.rawConnection.responseHttpCode = 201;  
      mainNext(connection, true);
    };

    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select subject__c as subject, to__c as to_id, (select sfid from member__c where name = $1) as from_id from private_message__c where sfid = $2";
      client.query(sql, [connection.params.from, connection.params.id], function(err, rs) {
        if (!rs['rows'][0] || !rs['rows']) { next([]); }
        else {
          var body = {
            fromId: rs.rows[0].from_id,
            toId: rs.rows[0].to_id,
            event: 'Private Message',
            subject: rs.rows[0].subject,
            body: connection.params.body,
            parentId: connection.params.id
          };
          api.sfdc.org.apexRest({ uri: 'v.9/notifications', method: 'POST', body: body }, api.sfdc.oauth, function(err, res) {
            if (err) { console.error(err); }
            res.success = res.Success;
            next(res);
          });
        }
      })
    })
  }
};

exports.messagesUpdate = {
  name: "messagesUpdate",
  description: "Updates a specific private message. Method: PUT",
  inputs: {
    required: ['id', 'from', 'to', 'subject', 'body'],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "Message updated successfully."
  },
  version: 2.0,
  run: function(api, connection, mainNext){
    var next = function(data){
      connection.response.response = forcifier.deforceJson(data);
      mainNext(connection, true);
    };

    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "update private_message__c set from__c = (select sfid from member__c where name = $1), to__c = (select sfid from member__c where name = $2), subject__c = $3 where sfid = $4";
      client.query(sql, [connection.params.from, connection.params.to, connection.params.subject, connection.params.id], function(err, res) {
        if (!err) {
          var sql = "update private_message_text__c set body__c = $1 where private_message__c = $2";
          client.query(sql, [connection.params.body, connection.params.id], function(err, res) {
            if (!err) {
              res = {
                success: true,
                message: "Message updated successfully."
              };
            } else {
              res = {
                success: false,
                message: "Message partially updated."
              };
              console.log(err);
            }
            next(res);
          })
        } else {
          res = {
            success: false,
            message: "Message not updated."
          };
          console.log(err);
          next(res);
        }
      })
    })
  }
};
