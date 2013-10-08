var S = require('string');

exports.middleware = function(api, next){

    // parses the api_key from the Authorization request header:
    // header['Authorization'] = 'Token token="THIS-IS-MY-TOKEN"'
  var authorizationMiddleware = function(connection, actionTemplate, next){
    if(actionTemplate.authenticated === true){

      // if for dev we want to skip the API Key authentication for protected routes
      if (api.configData.general.skipAuthorization === true) { return next(connection, true); }

      var redis = api.redis.client;
      var authorization = connection.rawConnection.req.headers.authorization;   

      // if authorization found in the header
      if (typeof(authorization) != "undefined") {
        try {

          // parse the apiKey from: 'Token token="THIS-IS-MY-TOKEN"'
          var apiKey = S(authorization.split("=")[1]).replaceAll('"', '').s;

          // does the apiKey exist in the hash of api keys in redis?
          redis.hexists("api:keys", apiKey, function(error, found){
            if (found === 0) { 
              errorResponse(connection);
              next(connection, false); 
            }
            if (found === 1) { next(connection, true); }
          });      

        } catch (err) {
          console.log("Could not parse API Key: " + err.message);
          errorResponse(connection);    
          next(connection, false);
        }
      // if authorization not found in the header
      } else {
        errorResponse(connection);
        next(connection, false);
      }

    }else{
      next(connection, true);
    }
  }

  /**
  * With each request, we need to check the header and see
  * if an access_token was passed. If so, write that token
  * to the cache to be used for all
  * calls to salesforce for the request. If an access_token
  * was not found in the header, then write the 
  * api.sfdc.oauth.access_token
  * to be used for all calls to salesforce for the requets.
  *    header['oauth_token'] = 'some-long-token'
  **/
  var accessTokenMiddleware = function(connection, actionTemplate, next){
    var oauthToken = connection.rawConnection.req.headers.oauth_token;
    var cacheKey = "oauth:" + connection.id;

    // TODO -- this needs more work with sessions
    // check for a passed access token
    if (typeof(oauthToken) != "undefined") {
      console.log("[DEBUG] Found oauth token: " + oauthToken);
    // else use the public access token
    } else {
      oauthToken = api.sfdc.oauth
    }

    // create a session for this request and cache it
    connection.session = {
      id: connection.id,
      org: api.sfdc.oauth,
      orgType: 'public'
    };
    api.session.save(connection, next);

    next(connection, true);
  }  

  var errorResponse = function(connection) {
    connection.response.error = "unauthorized";
    connection.response.error_description = "This action requires authorization to continue.";
    connection.rawConnection.responseHttpCode = 401;     
  };  

  api.actions.preProcessors.push(authorizationMiddleware);
  api.actions.preProcessors.push(accessTokenMiddleware);

  next();
}