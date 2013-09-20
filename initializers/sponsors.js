var pg = require('pg').native

exports.sponsors = function(api, next){

  api.sponsors = {

    // methods

    /* 
    * Returns all accounts where type is 'Sponsor' from pg
    *
    * Returns a collection of account records
    */
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

    /* 
    * Returns a specific account by salesforce id from pg
    *
    * id - the salesforce id for the account
    *
    * Returns JSON containing the keys: success, message, access_token
    */
    fetch: function(id, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, name, can_admin_challenges__c, funds_available__c, logo__c from account where sfid = '" +id+ "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    }

  }
  next();
}