var configData          = require("../config").configData,
    actionHeroPrototype = require("actionHero").actionHeroPrototype;
var nock = require('nock');

// Silence logging
// configData.logAccessToken = false;
configData.logger.transports = [];
configData.servers.web.port = process.env.PORT;

module.exports = {
  testUrl: "http://localhost:" + configData.servers.web.port + "/v1",
  configData: configData,

  init: function (callback) {
    var self = this;
    if (!self.server) {
        self.server = new actionHeroPrototype();
        self.server.start({configChanges: configData}, function(err, api){
            self.api = api;
            // wait for sfdc connection. TODO : It's a temporary quick patch.
            setTimeout(function() {
              // nock.enableNetConnect('localhost:' + configData.servers.web.port);
              // nock.recorder.rec();
              callback();
            }, 2000);
        });
    } else {
      callback();
    }
  }
};