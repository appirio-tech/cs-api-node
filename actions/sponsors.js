var forcifier = require("forcifier")
  , utils = require("../utils")
  , _ = require("underscore")
  , pg = require('pg').native;

exports.sponsorsList = {
  name: "sponsorsList",
  description: "Fetches all sponsors. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select " + api.configData.defaults.sponsorsListFields+ " from account where type = 'Sponsor' order by name";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false});
        next(connection, true);
      });
    });
  }
};

exports.sponsorsFetch = {
  name: "sponsorsFetch",
  description: "Fetches a specific sponsor. Method: GET",
  inputs: {
    required: ['id'],
    optional: [],
  },
  authenticated: false,
  outputExample: { id: "001K000000f8R8aIAE", name: "Appirio", can_admin_challenges: true, funds_available: 0, logo: "http://cs-public.s3.amazonaws.com/sponsor-logos/appirio-logo.png" },
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select " + api.configData.defaults.sponsorsDetailsFields + " from account where sfid = $1";
      client.query(sql, [connection.params.id], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection);
        next(connection, true);
      })
    })
  }
};