var pg = require('pg').native

exports.members = function(api, next){

  api.members = {

    // methods

    /* 
    * Returns all members from from pg
    *
    * Returns a collection of member records
    */
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

    /* 
    * Returns a specific member from pg by membername
    *
    * membername - the name of the member to fetch
    * fields - the list of fields to return.  If no fields are specified then the default
    * are passed in form the action.
    *
    * Returns JSON containing the keys specified from the fields
    */
    fetch: function(membername, fields, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select " + fields+ " from member__c where name = '" +membername+ "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },
	
	/*
	* Updates a specific members field(s) in pg (members__c).
	*
	* membername - the name of the member to update
	* fieldsHash - the hash of the fields=values to update. If no fields are defined,
	* return a "No fields to update!" message with "success:false".
	*
	* Returns
	*/
	update: function( membername, fieldsHash, next ) {
		var client = new pg.Client(api.configData.pg.connString);
		client.connect(function(err) {
			if (err) { console.log(err); }
			next('');
		});
	}
	
  }
  
  next();
}
