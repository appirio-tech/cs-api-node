var forcifier = require("forcifier")
  , _ = require("underscore")

function processResponse(data, connection) {
  if (_.isEmpty(data)) {
    send404(connection);
  } else {
    connection.response.response = forcifier.deforceJson(_.first(data));
  }
}

function send404(connection) {
  connection.response.error = "not_found";
  connection.response.error_description = "The requested resource could not be found!";
  connection.rawConnection.responseHttpCode = 404;  
}

exports.processResponse = processResponse;
exports.send404 = send404;