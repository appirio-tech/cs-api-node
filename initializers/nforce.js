nforce = require("nforce");

exports.nforce = function(api, next){

  org = nforce.createConnection({
    clientId: api.configData.sfdc.clientId,
    clientSecret: api.configData.sfdc.clientSecret,
    redirectUri: api.configData.sfdc.callbackUrl + '/oauth/_callback',  
    environment: api.configData.sfdc.environment,
    mode: 'multi' 
  });

  api.boot = {
    _start: function(api, next){ 
      var sfdc = {};
      org.authenticate({ username: api.configData.sfdc.username, password: api.configData.sfdc.password}, function(err, resp){
        if(!err) {
          api.sfdc = {
            org: org, 
            oauth: resp
          }
          if (api.configData.general.logAccessToken !== false) {
            console.log('Access Token: ' + api.sfdc.oauth.access_token);
          }

          // api.sfdc.org.query('SELECT Id FROM Account LIMIT 1', api.sfdc.oauth, function(err, res) {
          //   if(err) console.error(err);
          //   else console.log(res.records[0]);
          // });

        } else {
          console.log('Error connecting to Salesforce: ' + err.message);
        }
      });
      next();
    }
  };  
  next();
}
