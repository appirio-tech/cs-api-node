var pg = require('pg').native
  , async = require("async");

exports.accounts = function(api, next){

  api.accounts = {

    authenticate: function(membername, password, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        async.waterfall([

            // query pg for the user data
            function findUser(callback){
              find(membername, function(err, user)  {
                if (err) { callback(err); }
                if (!err) { callback(null, user); }                
              })
            },

            // check and see if we need to activiate user
            function activateUser(user, callback){
              // if the user is inactive, we need to activate them
              if (!user.isactive) {
                activate(membername, function(err, results)  {
                  if (err) { next( { success: false, message: err.message } ); }
                  if (!err) { next(user); }                
                })
              // if active already, just pass the user to the next method
              } else {
                callback(null, user);
              }
            },    
            
            // authenticate with their credentials
            function authenticateUser(user, callback){
              authenticate(user.sfdc_username, password, function(err, results)  {
                if (err) { next( { success: false, message: err.message } ); }
                if (!err) { callback(null, results); }                
              })          
            }
        ],

        // final callback
        function(err, results){
          if (err) { next( { success: false, message: err.message } ); }
          if (!err) { next(results); }
        });   
      })
    },    

    // find an account by username
    find: function(membername, next) {
      find(membername, function(err, user)  {
        if (err) { next( { success: false, message: err.message } ); }
        if (!err) { next(user); }                
      })
    },    

    // not sure if being used
    findByService: function(service, serviceName, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }

        if (service == 'cloudspokes') {

        } else {
          // run this query first
          // select u.username, m.name as membername, m.profile_pic__c, m.email__c, m.account__c from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where u.third_party_account__c = 'google_oauth2' and u.third_party_username__c = 'jdouglas@appirio.com';
        }

        var sql = "select u.lastlogindate, u.fullphotourl, u.third_party_username__c, u.smallphotourl, u.alias, u.username, u.third_party_account__c, u.isactive, u.sfid as id, m.name as membername, m.account__c, m.profile_pic__c, m.email__c from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = '" + membername + "'";
        client.query(sql, function(err, rs) {

          if (rs['rows'].length == 0) {
            var user = {
              success: false,
              message: "No user could be found with specified service and member name."
            }
          } else {
            var user = { 
              success: true, 
              membername: results[0].membername, 
              sfdc_username: results[0].username, 
              profile_pic: results[0].profile_pic__c, 
              email: results[0].email__c, 
              accountid: results[0].account__c };            
          }

          next(user);
        })

      })
    },

    // not sure if being used
    findUserByMemberName: function(membername, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select u.lastlogindate, u.fullphotourl, u.third_party_username__c, u.smallphotourl, u.alias, u.username, u.third_party_account__c, u.isactive, u.sfid as id, m.name as membername, m.account__c, m.profile_pic__c, m.email__c from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = '" + membername + "'";
        client.query(sql, function(err, rs) {
          next(null, rs['rows']);
        })
      })
    },    

  }
  next();


  // private functions

  // find a member & user by name
  var find = function (membername, next) {
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select u.username, u.isactive, m.name as membername, m.profile_pic__c, m.email__c, m.account__c, m.time_zone__c from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = '" + membername + "'";
      client.query(sql, function(err, rs) {
        if (rs['rows'].length != 1) {
          next (new Error("Account not found for " + membername));
        } else {
          var user = { 
            success: true, 
            membername: rs['rows'][0].membername, 
            sfdc_username: rs['rows'][0].username, 
            profile_pic: rs['rows'][0].profile_pic__c, 
            email: rs['rows'][0].email__c, 
            accountid: rs['rows'][0].account__c,
            isactive: rs['rows'][0].isactive,
            time_zone: rs['rows'][0].time_zone__c
          }
          next(null, user);     
        }      
      });
    });
  }

  // activiate a member/user by name
  var activate = function(membername, next) {
    api.sfdc.org.apexRest({uri:'v.9/activate/' + membername, method: 'GET'}, api.sfdc.oauth, function(err,resp){
      if(err) { 
        next(new Error("Could not activate '"+membername+"'."));
      }else{
        if (resp.Success) {
          next(null, {success: true, message: resp.Message} );
        } else {
          next(new Error("Could not activate '"+membername+"'."));
        }
      }
    })   
  }

  // authenticate a user with their credentials against sfdc
  var authenticate = function(username, password, next) {
    api.sfdc.org.authenticate({ username: username, password: password}, function(err, sfdc_resp){
      // successful login
      if (!err) { 
        resp = {
          success: true,
          message: "Successful sfdc login.",
          access_token: sfdc_resp.access_token
        };
        next(null, resp);
      }
      // error logging in. return the sfdc error
      if (err) { next(new Error(err.message)); }
    });    
  }  

}

