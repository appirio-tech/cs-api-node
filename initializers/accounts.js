var pg = require("pg").native
  , forcifier = require("forcifier")
  , async = require("async");

exports.accounts = function(api, next){

  api.accounts = {

    /* 
    * Authenticates the user against salesforce using their
    * membername and password. First it finds theirs
    * salesforce username in pg then if their account is inactive,
    * it quickly activiates their account before logging them in.
    *
    * membername - the cloudspokes member name to authenticate
    * password - the member's sfdc password
    *
    * Returns JSON containing the keys: success, message, access_token
    */
    authenticate: function(membername, password, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        async.waterfall([

            // query pg for the user data
            function findUser(callback){
              findByName(membername, function(err, user)  {
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

        // final callback with the user data
        function(err, results){
          if (err) { next( { success: false, message: err.message } ); }
          if (!err) { next(results); }
        });   
      })
    },    

    /* 
    * Finds a member's account info by their membername.
    *
    * membername - the cs member name to find
    *
    * Returns JSON containing the keys: success, membername, sfdc_username,
    * profile_pic, email, accountid, isactive, time_zone    
    */
    findByName: function(membername, next) {
      findByName(membername, function(err, user)  {
        if (err) { next( { success: false, message: err.message } ); }
        if (!err) { next(user); }                
      })
    },    

    /* 
    * Finds a member's account info by their login service (google_oauth2)
    * and the username for that service (jdouglas@appirio.com). For 
    * CS users it simply uses their member name.   
    *    
    * service - the thirdparty or 'cloudspokes' service
    * serviceName - the associated username for the service or their CS member name
    *
    * Returns JSON containing the keys: success, membername, sfdc_username,
    * profile_pic, email, accountid, isactive, time_zone     
    */
    findByService: function(service, serviceName, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }

        if (service === "cloudspokes") {
          var sql = "select u.username, m.name as membername, m.profile_pic__c, m.email__c, m.account__c, u.isactive, m.time_zone__c " +
            "from member__c m inner join public.user u on m.sfdc_user__c = u.sfid " +
            "where m.username__c  = '"+serviceName+"' and u.third_party_username__c is null";
          var errorMessage = "No user could be found for '"+serviceName+"'."
        } else {
          var sql = "select u.username, m.name as membername, m.profile_pic__c, m.email__c, m.account__c, u.isactive, m.time_zone__c " +
            "from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where u.third_party_account__c = '"+service+"' and " +
            "u.third_party_username__c = '"+serviceName+"'"; 
          var errorMessage = "No user could be found for the specified service ("+service+") and name ("+serviceName+")."
        }        

        client.query(sql, function(err, rs) {

          if (rs["rows"].length == 0) {
            var user = {
              success: false,
              message: errorMessage
            }
          } else {
            var user = { 
              success: true, 
              membername: rs["rows"][0].membername, 
              sfdc_username: rs["rows"][0].username, 
              profile_pic: rs["rows"][0].profile_pic__c, 
              email: rs["rows"][0].email__c, 
              accountid: rs["rows"][0].account__c,
              isactive: rs["rows"][0].isactive,
              time_zone: rs["rows"][0].time_zone__c
            }     
            // if the users is inactive, activate them
            if (!user.isactive) {
              activate(user.membername, function(err, results)  {
                if (err) { console.log("Could not activate "+user.membername+". Reason: " + err.message); }
                if (!err) { console.log(user.membername + " successfully activated.") }                
              })
            }
          }
          next(user);       
        })
      })
    },
    
	getPreferences: function(membername, next){
		getPreferences(membername, function(err, preferences)  {
        	if (err) { next( { success: false, message: err.message } ); }
        	if (!err) { next( { success: true, response:preferences, count:preferences.length } ); }
		});
	},

    /* 
    * Updates the marketing info for a member
    *
    * data - { membername, campaign_source, campaign_medium, campaign_name }
    *
    * Returns a status message
    */
    updateMarketingInfo: function(data, api, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "update member__c set campaign_source__c = '" + data.campaign_source + "', campaign_medium__c = '" + data.campaign_medium + "', campaign_name__c = '" + data.campaign_name + "' where name = '" + data.membername + "'; select sfid, name from community__c where marketing_campaign__c = '" + data.campaign_name + "'";
        client.query(sql, function(err, res) {
          if (!err) {
            if (res.rows[0] && res.rows[0].sfid) {
              var params = {
                membername: data.membername,
                community_id: res.rows[0].sfid
              }
              api.communities.addMember(params, function(addMemberResponse){
                if (addMemberResponse.success) {
                  res = {
                    success: true,
                    message: "Marketing info updated successfully. Added to community: " + res.rows[0].name
                  };
                } else {
                  res = {
                    success: true,
                    message: "Marketing info updated successfully. No matching community."
                  };
                }
                next(res);
              });
            } else {
              res = {
                success: true,
                message: "Marketing info updated successfully. No matching community."
              };
              next(res);
            }
          } else {
            res = {
              success: false,
              message: "Marketing info not updated."
            };
            console.log(err);
            next(res);
          }
        })
      })
    },

    /* 
    * Sets a member as being referred by another member
    *
    * data - { membername, referral_id_or_membername }
    *
    * Returns a status message
    */
    referredBy: function(data, api, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select (select sfid from member__c where name = '" + data.referral_id_or_membername + "') as referred_by_member, (select sfid from member__c where name = '" + data.membername + "') as converted_member";
        client.query(sql, function(err, rs) {
          if (!err) {
            if (rs.rows[0] && !rs.rows[0]['referred_by_member']) {
              sql = "update referral__c set converted__c = true, converted_to_member__c = '" + rs.rows[0]['converted_member'] + "' where sfid = '" + rs.rows[0]['referred_by_member'] + "'";
              client.query(sql, function(err, rs2) {
                if (!err) {
                  rs2 = {
                    success: true,
                    message: "Referral " + data.referral_id_or_membername + " assigned to newly converted member " + rs.rows[0]['converted_member'] + " successfully."
                  }
                } else {
                  rs2 = {
                    success: false,
                    message: "Error updating referral."
                  }
                  console.log(err);
                }
                next(rs2);
              })
            } else if (rs.rows[0] && !rs.rows[0]['converted_member']) {
              var status = {
                success: false,
                message: "Member not found."
              };
              next(status);
            } else {
              sql = "select id from referral__c where converted_to_member__c = '" + rs.rows[0]['converted_member'] + "'";
              client.query(sql, function(err, rs2) {
                if (!err) {
                  if (rs2.rows.length > 0) {
                    rs2 = {
                      success: true,
                      message: "Member already assigned."
                    }
                    next(rs2);
                  } else {
                    var timestamp = new Date().toISOString();
                    sql = "insert into referral__c (converted_to_member__c, referred_by_member__c, converted__c, include_in_member_count__c, source__c, createddate, lastmodifieddate) values ('" + rs.rows[0]['converted_member'] + "', '" + rs.rows[0]['referred_by_member'] + "', true, false, 'Member', '" + timestamp + "', '" + timestamp + "')";
                    client.query(sql, function(err, rs3) {
                      if (!err) {
                        rs3 = {
                          success: true,
                          message: "Referral " +  rs.rows[0]['converted_member']+ " assigned to " + rs.rows[0]['referred_by_member'] + "."
                        }
                      } else {
                        rs3 = {
                          success: false,
                          message: "Error creating referral record."
                        }
                        console.log(err);
                      }
                      next(rs3);
                    })
                  }
                } else {
                  rs2 = {
                    success: false,
                    message: "Error while trying to assign referral."
                  }
                  console.log(err);
                  next(rs2);
                }
              })
            }
          } else {
            rs = {
              success: false,
              message: "Error while trying to find members."
            }
            console.log(err);
            next(rs);
          }
        })
      })
    }
  } // end api.accounts

  next();


  /*********************** 
  * 
  * PRIVATE FUNCTIONS
  *   
  ************************/

  /* 
  * Finds a member's account info by their membername from pg.
  *
  * membername - the cs member name to find
  *
  * Returns JSON containing the keys: success, membername, sfdc_username,
  * profile_pic, email, accountid, isactive, time_zone. If the member is not
  *  found, returns an error 'Account not found for badmember'.
  */
  var findByName = function (membername, next) {
    var client = new pg.Client(api.configData.pg.connString);
    client.connect(function(err) {
      if (err) { console.log(err); }
      var sql = "select u.username, u.isactive, m.name as membername, m.profile_pic__c, m.email__c, m.account__c, m.time_zone__c " +
        "from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = '" + membername + "'";
      client.query(sql, function(err, rs) {
        if (rs["rows"].length != 1) {
          next (new Error("Account not found for " + membername));
        } else {
          var user = { 
            success: true, 
            membername: rs["rows"][0].membername, 
            sfdc_username: rs["rows"][0].username, 
            profile_pic: rs["rows"][0].profile_pic__c, 
            email: rs["rows"][0].email__c, 
            accountid: rs["rows"][0].account__c,
            isactive: rs["rows"][0].isactive,
            time_zone: rs["rows"][0].time_zone__c
          }
          next(null, user);     
        }      
      });
    });
  }
	 
  /* 
  * Calls an Apex REST service to activate an account.
  *
  * membername - the cs member name to activate
  *
  * Returns JSON containing the keys: success, message    
  */
  var activate = function(membername, next) {
    api.sfdc.org.apexRest({uri:"v.9/activate/" + membername, method: 'GET'}, api.sfdc.oauth, function(err,resp){
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

  /* 
  * Authenticates the user against salesforce using their
  * membername and password.
  *
  * username - the member's sfdc username
  * password - the member's sfdc password
  *
  * Returns JSON containing the keys: success, message, access_token    
  */
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
	
  /*
   * Fetches preferences for an account by membername from Apex REST service.
   *
   * membername - the cs member name to get preferences for
   *
   * Returns JSON containing an array of preferences:
   *	[ { attributes:	{	type: String,
   *						url: String,
   *						event: String,
   *						event_per_member: String,
   *						notification_method: String,
   *						member: String,
   *						do_not_notify: Boolean,
   *						id: String						}
   *	} ]
   */
   var getPreferences = function(membername, next){
   	api.sfdc.org.apexRest({uri:"v.9/notifications/preferences/" + membername, method: 'GET'}, api.sfdc.oauth, function(err,sfdc_resp){
        if(err) {
          next(new Error("Could not fetch preferences for '"+membername+"'."));
        }else{
          var preferences = [];
          sfdc_resp.forEach( function(item){
            preferences.push( forcifier.deforceJson(item) );
          });
          next(null, preferences);
        }
  	})
   };
}

