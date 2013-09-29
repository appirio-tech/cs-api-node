var forcifier = require("forcifier")
  , utils = require("../utils")

exports.action = {
  name: "deliverablesList",
  description: "Fetches all deliverables for a specific challenge participant. Method: GET",
  inputs: {
    required: ['membername', 'challenge_id'],
    optional: [],
  },
  authenticated: false,
  outputExample: [
    {
      "id": "a1LK0000001GHSIMA4",
      "type": "Code",
      "comments": "test",
      "username": null,
      "password": null,
      "language": "Apex",
      "url": "https://s3.amazonaws.com/cs-sandbox/challenges/22/jeffdonthemic/builder.png",
      "hosting_platform": "Salesforce.com"
    },
    {
      "id": "a1LK0000001GHT1MAO",
      "type": "Code",
      "comments": null,
      "username": null,
      "password": null,
      "language": "Apex",
      "url": "https://s3.amazonaws.com/cs-sandbox/challenges/22/jeffdonthemic/builder.png",
      "hosting_platform": "Salesforce.com"
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.list(connection.params, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.deliverablesCurrentSubmissions = {
  name: "deliverablesCurrentSubmissions",
  description: "Returns a member's submissions for a specific challenge. Method: GET",
  inputs: {
    required: ['membername', 'challenge_id'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "attributes": {
      "type": "Challenge_Submission__c",
      "url": "/services/data/v22.0/sobjects/Challenge_Submission__c/a0DK00000095XjUMAU"
    },
    "challenge__r": {
      "attributes": {
        "type": "Challenge__c",
        "url": "/services/data/v22.0/sobjects/Challenge__c/a0GK0000006k4wjMAA"
      },
      "name": "First2Finish - Test Upload",
      "id": "a0GK0000006k4wjMAA"
    },
    "name": "CS-29673",
    "url": "https://s3.amazonaws.com/cs-sandbox/challenges/22/jeffdonthemic/builder.png",
    "comments": "test",
    "type": "Code",
    "id": "a0DK00000095XjUMAU",
    "username": "jeffdonthemic",
    "challenge": "a0GK0000006k4wjMAA"
  },
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.current_submissions(connection.params, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.deliverablesFetch = {
  name: "deliverablesFetch",
  description: "Returns the specific submission. Method: GET",
  inputs: {
    required: ['membername', 'challenge_id', 'submission_id'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "id": "a0DK000000B7ekAMAR",
    "comments": "test",
    "type": "Video",
    "url": "https://s3.amazonaws.com/cs-sandbox/challenges/3/jeffdonthemic/sfdc-thurgood-src.zip",
    "username": "jeffdonthemic",
    "language": null
  },
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.fetch(connection.params, function(data){
      utils.processResponse(data, connection);
      next(connection, true);
    });
  }
};

exports.deliverablesDeleteSubmission = {
  name: "deliverablesDeleteSubmission",
  description: "Deletes the specified submission. Method: GET",
  inputs: {
    required: ['membername', 'challenge_id', 'submission_id'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "Submission removed successfully."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.deleteSubmission(connection.params, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.deliverablesCreateSubmission = {
  name: "deliverablesCreateSubmission",
  description: "Adds a submission by a member for the specified challenge. Method: POST",
  inputs: {
    required: ['membername', 'challenge_id'],
    optional: ['link', 'type', 'language', 'comments'],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "Submission created successfully."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.createSubmission(connection.params, function(data){
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.deliverablesCreate = {
  name: "deliverablesCreate",
  description: "Creates a new deliverable for a participant. Method: POST",
  inputs: {
    required: ['membername', 'challenge_id', 'data'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "Deliverable created successfully."
  },
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.create(connection.params, function(data){
      connection.response.response = forcifier.deforceJson(data);
      if (connection.response.response.success)
        connection.rawConnection.responseHttpCode = 201;
      next(connection, true);
    });
  }
};

exports.deliverablesUpdate = {
  name: "deliverablesUpdate",
  description: "Updates a deliverable for a participant. Method: PUT",
  inputs: {
    required: ['membername', 'challenge_id', 'data'],
    optional: [],
  },
  authenticated: false,
  outputExample: {
    "success": true,
    "message": "a0DK000000F0gFHMAZ"
  },
  version: 2.0,
  run: function(api, connection, next){
    api.deliverables.update(connection.params, function(data){
      connection.response.response = forcifier.deforceJson(data);
      next(connection, true);
    });
  }
};
