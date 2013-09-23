var forcifier = require("forcifier")
  , _ = require("underscore")


/* 
* Process the response sent back to the client. If 
* the data contains 0 records, a 404 will be returned (you can
* override this by passing false for 'throw404' and it will return
* and empty array), if only one record exists in the array, that
* element will be returned, else the entire array is returned.
*
* data - the data to be returned to the client
* connection - the scoped connection object
* throw404 - a boolean to determine whether or not to throw
*   a 404 error if 0 records exist in the data. Default is true
*   if 'undefined'.
*/
function processResponse(data, connection, throw404) {
  if (typeof(throw404)=="undefined") throw404 = true;
  if (_.isEmpty(data) && throw404) {
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

exports.processResponse = processResponse;
exports.send404 = send404;