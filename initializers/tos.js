var pg = require('pg').native

exports.tos = function(api, next){

  api.tos = {

    // methods

    /* 
    * Returns all terms of service documents from pg
    *
    * Returns a collection of TOS document records
    */
    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, name, terms__c, default_tos__c " +
                  "from terms_of_service__c order by name";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    /* 
    * Returns a specific TOS document by salesforce id from pg
    *
    * id - the salesforce id for the account
    *
    * Returns JSON containing the keys: id, name, terms, default_tos
    */
    fetch: function(id, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, name, terms__c, default_tos__c " +
                  "from terms_of_service__c where sfid='" + id + "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }

  }
  next();
}