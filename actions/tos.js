var utils = require("../utils"); 

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
    api.tos.list(function(data){
      utils.processResponse(data, connection);
      next(connection, true);
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
    api.tos.fetch(connection.params.id, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};