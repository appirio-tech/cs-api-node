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
* options :
*   throw404 - a boolean to determine whether or not to throw
*     a 404 error if 0 records exist in the data. Default is true
*     if 'undefined'.
*   smartParsing - a boolean to determin whether or not to make the array of size 1 a object.
*     for example, [{a:1}] will be responded as {a:1}
*                  [{a:1}, {a:2}] will be responed as [{a:1}, {a:2}]
*/
function processResponse(data, connection, options) {
  options = _.extend({
    throw404: true,
    smartParsing: true
  }, options);

  if (_.isEmpty(data) && options.throw404) {
    send404(connection);
  } else if (data.length === 1 && options.smartParsing) {
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
