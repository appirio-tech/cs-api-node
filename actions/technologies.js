var _ = require("underscore")

exports.action = {
  name: "technologiesList",
  description: "Fetches all technologies. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: ["JavaScript", "jQuery", "Node.js", "Other", "Python", "Redis", "Ruby"],
  version: 2.0,
  run: function(api, connection, next){
    api.technologies.list(function(data){
      connection.response.response = _.pluck(data, 'name');
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};