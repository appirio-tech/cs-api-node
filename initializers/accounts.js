var pg = require('pg').native
  , async = require("async");

exports.accounts = function(api, next){

  api.accounts = {

    // methods

    authenticate: function(memberName, password, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        async.waterfall([

            // query pg for the user data
            function getUser(callback){
              var sql = "select u.username, u.isactive, m.name as memberName from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = '" + memberName + "'";
              client.query(sql, function(err, rs) {
                if (rs['rows'].length == 1) { 
                  callback(null, rs['rows'][0]); 
                } else {
                  callback(new Error("Member '"+memberName+"' not found."));
                }
              })
            },

            // check and see if we need to activiate user
            function activate(user, callback){
              if (!user.isactive) {
                api.sfdc.org.apexRest({uri:'v.9/activate/' + user.name, method: 'GET'}, api.sfdc.oauth, function(err,resp){
                  if(!err) { 
                    console.log(resp);
                    if (resp.Success == 'true') {
                      callback(null, user);
                    } else {
                      callback(new Error("Could not activate '"+memberName+"'."));
                    }
                  }else{
                    console.log(err);
                    callback(new Error("Could not activate '"+memberName+"'."));
                  }
                })
              } else {
                callback(null, user);
              }
            },    
            
            // authenticate with their credentials
            function authenticate(user, callback){
              api.sfdc.org.authenticate({ username: user.username, password: password}, function(err, sfdc_resp){
                // successful login
                if (!err) { 
                  resp = {
                    success: true,
                    message: "Successful sfdc login.",
                    access_token: sfdc_resp.access_token
                  };
                }
                // error logging in. return the sfdc error
                if (err) { 
                  resp = {
                    success: false,
                    message: err.message
                  };
                }
                callback(null, resp);
              });                
            }
        ],

        // final callback
        function(err, results){
          if (err) {
            resp = {
              success: false,
              message: err.message
            };
            next(resp);
          } else {
            next(results);
          }
        });   
      })
    },    

    findByService: function(service, serviceName, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }

        var sql = "select u.lastlogindate, u.fullphotourl, u.third_party_username__c, u.smallphotourl, u.alias, u.username, u.third_party_account__c, u.isactive, u.sfid as id, m.name as memberName, m.account__c, m.profile_pic__c, m.email__c from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = '" + memberName + "'";
        client.query(sql, function(err, rs) {

          if (rs['rows'].length == 0) {
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
        })

      })
    },

    findUserByMemberName: function(memberName, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select u.lastlogindate, u.fullphotourl, u.third_party_username__c, u.smallphotourl, u.alias, u.username, u.third_party_account__c, u.isactive, u.sfid as id, m.name as memberName, m.account__c, m.profile_pic__c, m.email__c from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = '" + memberName + "'";
        client.query(sql, function(err, rs) {
          next(null, rs['rows']);
        })
      })
    },    

  }
  next();
}