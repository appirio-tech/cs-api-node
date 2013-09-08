var pg = require('pg').native

exports.members = function(api, next){

  api.members = {

    // methods

    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select id, sfid, name, email__c from member__c limit 5";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    fetch: function(memberName, fields, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select " + fields+ " from member__c where name = '" +memberName+ "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }

  }
  next();
}