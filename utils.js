var forcifier = require("forcifier")
  , _ = require("underscore")

function processResponse(data, connection) {
  if (_.isEmpty(data)) {
    send404(connection);
  } else if (data.length === 1) {
    connection.response.response = forcifier.deforceJson(_.first(data));
    connection.response.count = 1;
  } else { 
    connection.response.response = forcifier.deforceJson(data);
    connection.response.count = data.length;
  }
}

function send404(connection) {
  connection.response.error = "not_found";
  connection.response.error_description = "The requested resource could not be found!";
  connection.rawConnection.responseHttpCode = 404;  
}

// enforce orderBy params.
// for 'orderBy' params, it could be passed as 'wins desc'
// so need to enforce 'wins' and not desc
function enforceOrderByParam(orderBy, defaultValue) {
  if(!orderBy) { return defaultValue; }

  if(orderBy.indexOf(' ') > 0) {
    // if orderBu is something like 'wins desc'
    return orderBy.replace(' ', '__c ');
  }
  else {
    return orderBy + "__c";
  }
}

exports.processResponse = processResponse;
exports.send404 = send404;
exports.enforceOrderByParam = enforceOrderByParam;