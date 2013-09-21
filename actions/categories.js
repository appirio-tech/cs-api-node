var _ = require("underscore")

exports.action = {
  name: "categoriesList",
  description: "Fetches all categories. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: ['Code', 'Design', 'First2Finish'],
  version: 2.0,
  run: function(api, connection, next){
    api.categories.list(function(data){
      connection.response.response = _.pluck(data, 'name');
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};