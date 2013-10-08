var utils = require("../utils"); 

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
  run: function(api, connection, next){
    api.platform.stats(function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};
