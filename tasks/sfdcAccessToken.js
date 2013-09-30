var nforce = require("nforce")

exports.task = {
  name: "sfdcAccessToken",
  description: "Refreshes the Salesforce access token in the cache.",
  scope: "any",
  frequency: (1000 * 60 * 30), // every 30 minute for now
  toAnnounce: true,
  run: function(api, params, next){

    org = nforce.createConnection({
      clientId: api.configData.sfdc.clientId,
      clientSecret: api.configData.sfdc.clientSecret,
      redirectUri: api.configData.sfdc.callbackUrl + '/oauth/_callback',  
      environment: api.configData.sfdc.environment,
      mode: 'multi' 
    });    

    org.authenticate({ username: api.configData.sfdc.username, password: api.configData.sfdc.password}, function(err, resp){
      if(!err) {
        api.sfdc = {
          org: org, 
          oauth: resp
        }        
        if (api.configData.general.logAccessToken !== false) {
          console.log('[INFO] Access Token: ' + resp.access_token);
        }
        next(null, true);        
      } else {
        console.log('[FATAL] Error connecting to Salesforce: ' + err.message);
        next(error, true);
      }
    });

  }
};
