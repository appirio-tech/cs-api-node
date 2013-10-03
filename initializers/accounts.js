var pg = require("pg").native
  , forcifier = require("forcifier")
  , _ = require("underscore")
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
            "where m.username__c  = $1 and u.third_party_username__c is null";
          var errorMessage = "No user could be found for '"+serviceName+"'."
        } else {
          var sql = "select u.username, m.name as membername, m.profile_pic__c, m.email__c, m.account__c, u.isactive, m.time_zone__c " +
            "from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where u.third_party_account__c = '"+service+"' and " +
            "u.third_party_username__c = $1"; 
          var errorMessage = "No user could be found for the specified service ("+service+") and name ("+serviceName+")."
        }        

        client.query(sql, [serviceName], function(err, rs) {

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
    
    /*
     * Fetches preferences for a specified member
     *
     * membername - the username of the member to get the preferences for
     *
     * Returns JSON response with the keys: success, count, response.
	 * 	count is the length of the response array, containing preferences:
	 *	{ attributes:	{	type: String,
	 *						url: String		},
	 *		event: String,
	 *		event_per_member: String,
	 *		notification_method: String,
	 *		member: String,
	 *		do_not_notify: Boolean,
	 *		id: String
	 *	}
	 */
	getPreferences: function(membername, next){
		getPreferences(membername, function(err, response)  {
        	if (err) { next( { success: false, message: err.message } ); }
        	if (!err) { next( response ); }
		});
	},
	
	
    /*
     * Create an account using APEX REST service.
     * First, it creates the options from the input parameters, then makes
     * the actual request.
     *
     * params - hash containing values to use for new user
     *		- for third-party: provider, provider_username, username, email, name (can be blank)
     *		- for cloudspokes: username, email, password
     *
     * Returns	JSON with the following keys: success, message
     * 	If successful, icludes also keys: username, sfdc_username
     */
    create: function( params, next ){
      createOptions( params, function( err, options ){
        if(err) { next( { success: false, message: err.message }); };
        if(!err) {
          createAccount( options, function( err, response ){
            if(err) { next( { success: false, message: err.message }); };
            if(!err) { next( response ) };
          });
        }
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
        var sql = "update member__c set campaign_source__c = $1, campaign_medium__c = $2, campaign_name__c = $3 where name = $4";
        client.query(sql, [data.campaign_source, data.campaign_medium, data.campaign_name, data.membername], function(err, res) {
          if (!err) {
            var sql = "select sfid, name from community__c where marketing_campaign__c = $1";
            client.query(sql, [data.campaign_name], function(err, res) {
              if (res.rows && res.rows[0] && res.rows[0].sfid) {
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
            });
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
        var sql = "select (select sfid from member__c where name = $1) as referred_by_member, (select sfid from member__c where name = $2) as converted_member";
        client.query(sql, [data.referral_id_or_membername, data.membername], function(err, rs) {
          if (!err) {
            if (rs.rows[0] && !rs.rows[0]['referred_by_member']) {
              sql = "update referral__c set converted__c = true, converted_to_member__c = $1 where sfid = $2";
              client.query(sql, [rs.rows[0]['converted_member'], rs.rows[0]['referred_by_member']], function(err, rs2) {
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
              sql = "select id from referral__c where converted_to_member__c = $1";
              client.query(sql, [rs.rows[0]['converted_member']], function(err, rs2) {
                if (!err) {
                  if (rs2.rows.length > 0) {
                    rs2 = {
                      success: true,
                      message: "Member already assigned."
                    }
                    next(rs2);
                  } else {
                    var timestamp = new Date().toISOString();
                    sql = "insert into referral__c (converted_to_member__c, referred_by_member__c, converted__c, include_in_member_count__c, source__c, createddate, lastmodifieddate) values ($1, $2, true, false, 'Member', $3, $3)";
                    client.query(sql, [rs.rows[0]['converted_member'], rs.rows[0]['referred_by_member'], timestamp], function(err, rs3) {
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
    },

    /* 
    * Updates a member's password-reset token
    *
    * data - { membername, token }
    *
    * Returns a status message
    */
    updatePassToken: function(data, api, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfdc_user__c as sfid from member__c where name = $1";
        client.query(sql, [data.membername], function(err, res) {
          if (err) {
            res = {
              success: false,
              message: "Error while trying to find user."
            };
            console.log(err);
            next(res);
          } else if (!res['rows'] || !res['rows'][0]) {
            res = {
              success: false,
              message: "Member not found."
            };
            next(res);
          } else {
            var params = [
              {
                key: 'id',
                value: res.rows[0].sfid
              },
              {
                key: 'token',
                value: data.token
              }
            ];
            api.sfdc.org.apexRest({ uri: 'v.9/password-change', method: 'PUT', urlParams: params }, api.sfdc.oauth, function(err, res) {
              if (err) { console.error(err); }
              res.Success = res.Success == "true";
              next(res);
            });
          }
        })
      })
    },

    /*
    * Resets a member's password
    *
    * params - { membername, token, new_password }
    *
    * Returns a status message
    */
    changePassWithToken: function(data, api, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select sfdc_user__c as sfid from member__c where name = $1";
        client.query(sql, [data.membername], function(err, res) {
          if (err) {
            res = {
              success: false,
              message: "Error while trying to find user."
            };
            console.log(err);
            next(res);
          } else if (!res['rows'] || !res['rows'][0]) {
            res = {
              success: false,
              message: "Member not found."
            };
            next(res);
          } else {
            var params = [
              {
                key: 'id',
                value: res.rows[0].sfid
              },
              {
                key: 'token',
                value: data.token
              },
              {
                key: 'password',
                value: data.new_password
              }
            ];
            api.sfdc.org.apexRest({ uri: 'v.9/password-change', method: 'PUT', urlParams: params }, api.sfdc.oauth, function(err, res) {
              if (err) { console.error(err); }
              res.Success = res.Success == "true";
              next(res);
            });
          }
        })
      })
    },

    /*
    * Updates a member's notification preferences
    *
    * params - { membername, preferences }
    *
    * Returns a status message
    */
    updatePreferences: function(params, next) {
      try {
        var preferences = JSON.parse(params.preferences);
        api.sfdc.org.apexRest({ uri: 'v.9/notifications/preferences/' + params.membername, method: 'PUT', body: preferences }, api.sfdc.oauth, function(err, res) {
          if (err) { console.error(err); }
          res.Success = Boolean(res.Success);
          next(res);
        });
      } catch(err) {
        next({
          success: false,
          message: "Invalid json in the 'preferences' parameter"
        });
      }
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
        "from public.user u inner join member__c m on m.sfdc_user__c = u.sfid where m.name = $1";
      client.query(sql, [membername], function(err, rs) {
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
          next(null, sfdc_resp);
        }
  	})
   };
	 
	 /*
	  * Sanitizes and prepares data for account registration
	  *
	  * params - hash containing values to use for new user
	  *		- for third-party: provider, provider_username, username, email, name (can be blank)
	  *		- for cloudspokes: username, email, password
	  *
	  * Returns JSON containing the keys: body.username__c, body.email__c,
	  *		[ 	body.password || body.first_name__c, body.last_name__c,
	  *			body.third_party_account__c, third_party_username__c	]
	  */
	 var createOptions = function( params, next ){
	 	var options = {
        	username__c: params.username,
        	email__c: params.email
		};
		
		var error, new_options;
		
		// third party
		if( params.provider ) {
			// sanitize data...
			if ( _.has(params, 'provider_username') ) {
		    	var names, first_name, last_name;
		    	
				// if the name is blank
				if( params.name ) {
					// split up the name into a first and last
					names = params.name.split;
					first_name = names[0];
					last_name = names.length > 1 ? names[1] : first_name;
				} else {
					first_name = params.username;
					last_name = params.username;
				}
				
				new_options = {
					"first_name__c": first_name,
					"last_name__c": last_name,
					"third_party_account__c": params.provider,
					"third_party_username__c":params.provider_username
				}
			} else {
				error = new Error("Third parties need to provide provider_username.");
			}
      	}
      	
      	// cloudspokes
		else {
			// sanitize data...
			if ( _.isUndefined(params.password) ) {
				error = new Error("Creation of account as cloudspokes needs a password.");
			} else {
				new_options = {
					first_name__c: params.username,
					last_name__c: params.username,
					password: params.password
				}
			}
        }
		
		if( !_.isUndefined( new_options ) )
			_.extend(options, new_options);
		
		var result;
		
		// if no error so far, convert object into string of "key1=value1, key2=value2"...
		if( _.isUndefined( error ) ) {
			var pairs = _.pairs(options);
			result = "";
			
			// no worries about the extra '&' at the end of the result!
			pairs.forEach( function(item) {
				result += item[0].toString() + "=" + item[1].toString() + "&";
			});
		}
		
		next( error, result );
	 };
	 
	 /*
	  * Call to APEX REST service to create an account.
	  *
	  * options	the parsed input obtained with createOptions containing the fields
	  *			to regiter the account with. See method createOptions return value
	  *			for details.
	  *
	  * Returns	JSON with the following keys: success, message (, username, sfdc_username)
	  */
	 var createAccount = function( options, next ) {
	 	api.sfdc.org.apexRest({uri:"v.9/members", method: 'POST', body: options}, api.sfdc.oauth, function(err,sfdc_resp){
			if(	err ) {
				next(new Error("Error creating account!"));
			}else{
			
				/**
				 *	Successful response example:
				 *  {
				 *		"password": "1a2b3c4d",		// should not be included
				 *		"success": true,
				 *		"memberid": "a0IK0000007XJurMAG",	// should not be included
				 *		"sfdc_username": "testuser@m.cloudspokes.com.sandbox",
				 *		"message": "Member created successfully.",
				 *		"username": "testuser"
				 *	}
				 */
				 
				// normalize 'Success' to Boolean value...
		 		sfdc_resp['Success'] = ( _.has(sfdc_resp, 'Success') && sfdc_resp['Success'].toLowerCase() === 'true') ? true : false;
		 		var response = forcifier.deforceJson(sfdc_resp);
		 		
		 		if( response.success )
			 		// filter response to include only whitelisted keys...
			 		response = _.pick(response, 'success', 'username', 'sfdc_username', 'message');
		 		
				next(null, response);
			}
		})
	 };
}

