var configData          = require("../config").configData,
    actionHeroPrototype = require("actionHero").actionHeroPrototype;

// Silence logging
configData.logAccessToken = false;
configData.logger.transports = [];

module.exports = {
  testUrl: "http://localhost:" + configData.servers.web.port + "/v1",
  configData: configData,

  init: function (callback) {
    var self = this;
    if (!self.server) {
        self.server = new actionHeroPrototype();
        self.server.start({configChanges: configData}, function(err, api){
            self.api = api;
            callback();
        });
    } else {
      callback();
    }
  }
};
