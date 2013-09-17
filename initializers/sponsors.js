var pg = require('pg').native

exports.sponsors = function(api, next){

  api.sponsors = {

    // methods

    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, name, can_admin_challenges__c, funds_available__c, logo__c from account where type = 'Sponsor' order by name";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    fetch: function(sfid, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, name, can_admin_challenges__c, funds_available__c, logo__c from account where sfid = '" +sfid+ "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }

  }
  next();
}