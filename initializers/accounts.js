var pg = require('pg').native

exports.accounts = function(api, next){

  api.accounts = {

    // methods

    findByService: function(service, serviceName, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }

        // if service == 'cloudspokes'
        api.accounts.findUserByMemberName("jeffdonthemic", function(error, results){
          console.log(results)
          if (results.length == 0) {
            var user = {
              success: false,
              message: "No user could be found with specified service and username."
            }
          } else {
            var user = { 
              success: true, 
              username: results[0].membername, 
              sfdc_username: results[0].username, 
              profile_pic: results[0].profile_pic__c, 
              email: results[0].email__c, 
              accountid: results[0].account__c };            
          }
          
          next(user);
        });
        // else if service is third party
      })
    },

    findUserByMemberName: function(memberName, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select u.lastlogindate, u.fullphotourl, u.third_party_username__c, u.smallphotourl, u.alias, u.username, u.third_party_account__c, u.isactive, u.sfid as id, m.name as memberName, m.account__c, m.profile_pic__c, m.email__c from public.user u inner join member__c m on (m.sfdc_user__c = u.sfid) where m.name = '" + memberName + "'";
        client.query(sql, function(err, rs) {
          next(null, rs['rows']);
        })
      })
    },    

  }
  next();
}