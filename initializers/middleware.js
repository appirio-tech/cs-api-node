var S = require('string');

exports.middleware = function(api, next){

    // parses the api_key from the Authorization request header:
    // header['Authorization'] = 'Token token="THIS-IS-MY-TOKEN"'
  var authenticationMiddleware = function(connection, actionTemplate, next){
    if(actionTemplate.authenticated === true){

      /*
      var authorized = false;
      var authorization = connection.rawConnection.req.headers.authorization;

      // if authorization found in the header in the headers
      if (typeof(authorization) != "undefined") {
        try {
          var apiKey = S(authorization.split("=")[1]).replaceAll('"', '').s;
          authorized = true;
        } catch (err) {
          console.log("Could not parse API Key: " + err.message);
        }
      }

      if (authorized == true) {
        next(connection, true);
      } else {
        connection.response.error = "unauthorized";
        connection.response.error_description = "This action requires authorization to continue.";
        connection.rawConnection.responseHttpCode = 401; 
        next(connection, false);
      }
      */
      next(connection, true);
    }else{
      next(connection, true);
    }
  }

  var accessTokenMiddleware = function(connection, actionTemplate, next){
    // TODO - fetch access token from header and set for request  
    next(connection, true);
  }  

  api.actions.preProcessors.push(authenticationMiddleware);
  api.actions.preProcessors.push(accessTokenMiddleware);

  next();
}