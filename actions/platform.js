var utils = require("../utils");
var soap = require('soap');

exports.action = {
  name: "platformStats",
  description: "platform",
  inputs: {
    required: [],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: {},
  version: 2.0,
  run: function(api, connection, mainNext){
    var next = function(data){
      utils.processResponse(data, connection);
      mainNext(connection, true);
    };

    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      // construct the header with the session token
      var header = { "SessionHeader": { "sessionId": session.oauth.access_token} }
      soap.createClient(process.env.STATS_WSDL_URL, function(err, client) {
        if (err) { 
          console.log(err); 
          next();
        }
        if (!err) {
          client.addSoapHeader(header);
          client.platformStats(null, function(err, result) {
            next(result.result);
          });
        }
      });
    });
  }
};
