var utils = require("../utils"); 
var pg = require('pg').native;

exports.tosList = {
  name: "tosList",
  description: "Fetches all TOS documents. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: [
    {
      attributes: {
        type: "Terms_of_Service__c",
        url: "/services/data/v26.0/sobjects/Terms_of_Service__c/a0kK0000001rtkRIAQ"
      },
      id: "a0kK0000001rtkRIAQ",
      name: "Standard Terms & Conditions",
      terms: "CloudSpokes Default TOS Text",
      default_tos: true
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select sfid as id, name, terms__c, default_tos__c " +
                "from terms_of_service__c order by name";
      client.query(sql, function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection, {"throw404": false});
        next(connection, true);
      });
    });
  }
};

exports.tosFetch = {
  name: "tosFetch",
  description: "Fetches a specific TOS document. Method: GET",
  inputs: {
    required: ["id"],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    attributes: {
      type: "Terms_of_Service__c",
      url: "/services/data/v26.0/sobjects/Terms_of_Service__c/a0kK0000001rtkRIAQ"
    },
    id: "a0kK0000001rtkRIAQ",
    name: "Standard Terms & Conditions",
    terms: "CloudSpokes Default TOS Text",
    default_tos: true
  },
  version: 2.0,
  run: function(api, connection, next){
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select sfid as id, name, terms__c, default_tos__c " +
                "from terms_of_service__c where sfid=$1";
      client.query(sql, [connection.params.id], function(err, rs) {
        var data = rs['rows'];
        utils.processResponse(data, connection);
        next(connection, true);
      });
    });
  }
};
