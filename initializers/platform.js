var soap = require('soap');

exports.platform = function(api, next){

  api.platform = {

    stats: function(next) {
      // construct the header with the session token
      var header = { "SessionHeader": { "sessionId": api.sfdc.oauth.access_token} }
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
    }

  }
  next();
}