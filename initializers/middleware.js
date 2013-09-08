exports.middleware = function(api, next){

  var authenticationMiddleware = function(connection, actionTemplate, next){
    if(actionTemplate.authenticated === true){
/**    
      var token = s(req.get('authorization').split('=')[1]).replaceAll('"','').s;
      //console.log(req.get('authorization'));
      //console.log('token: ' + token);
      // TODO - check and see if key matches database 
**/       
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