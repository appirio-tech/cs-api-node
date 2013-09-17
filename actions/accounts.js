exports.action = {
  name: "accountsFindByService",
  description: "Fetches an account by service",
  inputs: {
    required: ["service", "service_username"],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: {},
  authenticated: false,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.findByService(connection.params.service, connection.params.service_username, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.action = {
  name: "accountsAuthenticate",
  description: "Authenticates an account and passed back oauth connection",
  inputs: {
    required: ["membername", "password"],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: {},
  authenticated: false,
  version: 2.0,
  run: function(api, connection, next){
    api.accounts.authenticate(connection.params.membername, connection.params.password, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};
