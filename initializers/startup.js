exports.startup = function(api, next){
  // at startup, run the task to fetch the access token
  var task = new api.task({ name: "sfdcAccessToken"}).run();
  next();
}
