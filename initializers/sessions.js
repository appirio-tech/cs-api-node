exports.sessions = function(api, next){
  
  api.session = {
    prefix: "__session",
    duration: api.configData.general.sessionDuration,
  };
 
  api.session.save = function(connection, next){
    var key = api.session.prefix + "-" + connection.id;
    var value = connection.session;
    api.cache.save(key, value, api.session.duration, function(){
      api.cache.load(key, function(savedVal){
        if(typeof next == "function"){ next(); };
      });
    });
  }
 
  api.session.load = function(connection, next){
    var key = api.session.prefix + "-" + connection.id;
    api.cache.load(key, function(error, value, expireTimestamp, createdAt, readAt){
      connection.session = value;
      next(value, expireTimestamp, createdAt, readAt);
    });
  }
 
  api.session.delete = function(connection, next){
    var key = api.session.prefix + "-" + connection.id;
    api.cache.destroy(key, function(error){
      connection.session = null;
      next(error);
    });
  }
 
  next();
}