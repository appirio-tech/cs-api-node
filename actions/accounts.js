var utils = require("../utils")
  , forcifier = require("forcifier")

exports.accountsFind = {
  name: "accountsFindByName",
  description: "Fetches an account by member name. Method: GET",
  inputs: {
    required: ['membername'],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: { success: true, membername: "jeffdonthemic", sfdc_username: "jeffdonthemic@cs.sandbox", profile_pic: "http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg", email: "jdouglas@cloudspokes.com", accountid: "001K000000f8R8aIAE", isactive: true, time_zone: "Eastern Time (US & Canada)" },
  authenticated: true,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.findByName(connection.params.membername, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.accountsFindByService = {
  name: "accountsFindByService",
  description: "Fetches an account by service. Method: GET",
  inputs: {
    required: ["service", "service_username"],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: { success: true, membername: "jeffdonthemic", sfdc_username: "jeffdonthemic@cs.sandbox", profile_pic: "http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg", email: "jdouglas@cloudspokes.com", accountid: "001K000000f8R8aIAE", isactive: true, time_zone: "Eastern Time (US & Canada)" },
  authenticated: true,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.findByService(connection.params.service, connection.params.service_username, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.accountsAuthenticate = {
  name: "accountsAuthenticate",
  description: "Authenticates an account and passes back the status of the operation and if successful, an oauth token. Method: POST",
  inputs: {
    required: ["membername", "password"],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: { success: true, message: "Successful sfdc login.", access_token: "00DK000000AaVjP!AQYAQIKcNp8CLnjGOf73qNpuRtRbUPrD0AsL8FlYV85QlAuI5X4J432hqeMHHnnN.qcCv8JRe5yuiXxHPH1Nf9XXXXXXX"},
  authenticated: true,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.authenticate(connection.params.membername, connection.params.password, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.accountsGetPreferences = {
  name: "accountsGetPreferences",
  description: "Fetches preferences of an account. Method: GET",
  inputs: {
    required: ["membername"],
    optional: []
  },
  blockedConnectionTypes: [],
  outputExample: {
    success: true,
    // response is an array of objects following this format...
    response: [{ 
      attributes: {
        type: 'Notification_Settings__c',
      url: '/services/data/v27.0/sobjects/Notification_Settings__c/a17K0000000lk3gIAA'
    },
    event: 'Challenge Ending in 24 Hours',
    event_per_member: 'Challenge Ending in 24 Hoursa0IK0000007WlmQ',
    notification_method: 'Site;Email',
    member: 'a0IK0000007WlmQMAS',
    do_not_notify: false,
    id: 'a17K0000000lk3gIAA'
  }],
  // count is the length of the preferences array...
  count: 1
  },
  authenticated: true,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.getPreferences( connection.params.membername, function(data){
      utils.processResponse(data, connection, {throw404: false});
      next(connection, true);
    });
  }
};

exports.accountsUpdateMarketingInfo = {
  name: "accountsUpdateMarketingInfo",
  description: "Updates the marketing info for a member. Method: PUT",
  inputs: {
    required: ["membername", "campaign_source", "campaign_medium", "campaign_name"],

    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "Marketing info updated successfully. No matching community."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.updateMarketingInfo(connection.params, api, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.accountsReferredBy = {
  name: "accountsReferredBy",
  description: "Sets a member as being referred by another member. Method: PUT",
  inputs: {
    required: ["membername", "referral_id_or_membername"],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "Referral a0IK0000007SVSeMAO assigned to a0IK0000007NIQmMAO."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.referredBy(connection.params, api, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.accountsUpdatePassToken = {
  name: "accountsUpdatePassToken",
  description: "Updates a member's password-reset token. Method: PUT",
  inputs: {
    required: ["membername", "token"],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "Passcode successfully updated."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.updatePassToken(connection.params, api, function(data){
      connection.response.response = forcifier.deforceJson(data);
      next(connection, true);
    });
  }
};

exports.accountsChangePassWithToken = {
  name: "accountsChangePassWithToken",
  description: "Resets a member's password. Method: PUT",
  inputs: {
    required: ["membername", "token", "new_password"],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "Password changed successfully."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.changePassWithToken(connection.params, api, function(data){
      connection.response.response = forcifier.deforceJson(data);
      next(connection, true);
    });
  }
};

exports.accountsCreate = {
  name: "accountsCreate",
  description: "Creates a new account. Method: POST",
  inputs: {
    required: ["username", "email"],
    optional: ["password", "provider", "provider_username", "name" ]
  },
  blockedConnectionTypes: [],
  outputExample: {
    success: true,
    username: 'username',
    sfdc_username: 'sfdc_username',
    message: 'message'
  },
  authenticated: true,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.create( connection.params, function(data){
      console.log("accountsCreate:", data);
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.accountsUpdatePreferences = {
  name: "accountsUpdatePreferences",
  description: "Updates a member's notification preferences. Method: PUT",
  inputs: {
    required: ["membername", "preferences"],
    optional: []
  },
  blockedConnectionTypes: [],
  outputExample: {
    "success": true,
    "message": "Preferences successfully updated."
  },
  authenticated: false,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.updatePreferences(connection.params, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};
