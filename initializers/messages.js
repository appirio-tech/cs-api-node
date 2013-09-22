var pg = require('pg').native

exports.messages = function(api, next){

  api.messages = {

    // methods

    /* 
    * Returns a specific message by id from pg
    *
    * id - the id of the message
    *
    * Returns a message if it exists
    */
    fetch: function(id, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfid as id, name, createddate as created_date, lastmodifieddate as last_modified_date, to__c as to_id, (select name from member__c where sfid = to__c) as to_name, from__c as from_id, (select name from member__c where sfid = from__c) as from_name, subject__c, status_from__c, status_to__c, replies__c from private_message__c where sfid = '" + id + "'";
        client.query(sql, function(err, rs) {
          if (!rs['rows'] || !rs['rows'][0]) { next([]); }
          else {
            var sql2 = "select createddate as created_date, lastmodifieddate as last_modified_date, body__c from private_message_text__c where private_message__c = '" + id + "' order by createddate desc";
            client.query(sql2, function(err2, rs2) {
              rs['rows'][0].text = rs2['rows'];
              next(rs['rows']);
            })
          }
        })
      })
    }
  }
  next();
}
