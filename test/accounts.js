var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

// test_user and test_provider are used in the create account suite...
var test_user = {
	username: "test_user_" + new Date().getTime(),
	password: "1a2b3c4d"
};

var test_provider = {
	username: "test_provided_" + new Date().getTime(),
	password: "1a2b3c4d",
	provider: "test_provider",
	provider_username: "test_provider_username"
};

describe('GET /accounts/:membername/preferences', function () {
    before(function (done) {
        setup.init(done);
    });
    
    it('should be array, should have "count" number of elements', function (done) {
        request.get(setup.testUrl + '/accounts/port2node/preferences', function (err, response, body) {
            body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            assert.property( body, 'success' );
            assert.property( body, 'response' );
            assert.property( body, 'count' );
            
            assert.ok( body.success );
            assert.isArray( body.response );
            assert.lengthOf( body.response, body.count );
            
            done();
        });
    });
    
    it('each element should be well-formed', function(done) {
    	request.get(setup.testUrl + '/accounts/port2node/preferences', function (err, response, body) {
            body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            for ( var i = 0; i < body.count; i++ ) {
            	var pref = body.response[i];
            	
            	assert.property( pref, 'attributes' );
            	assert.deepProperty( pref, 'attributes.type' );
            	assert.deepProperty( pref, 'attributes.url' );
            	assert.property( pref, 'event' );
            	assert.property( pref, 'event_per_member' );
            	assert.property( pref, 'notification_method' );
            	assert.property( pref, 'member' );
            	assert.property( pref, 'do_not_notify' );
            	assert.property( pref, 'id' );
            	
            }
            
            done();
        });
    });
});

describe('POST /accounts/create', function () {
    before(function (done) {
        setup.init(done);
    });
    
    it('creating user without provided password should fail', function(done) {
    	var query_string = "username=" + test_user.username + "&"
        				 + "email=" + test_user.username + "@test.com";
        
    	request.post(setup.testUrl + '/accounts/create?' + query_string, function (err, response, body) {
			body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            // properties that should be in the response with exact values...
            assert.propertyVal( body, 'success', false );
            assert.propertyVal( body, 'message', 'Creation of account as cloudspokes needs a password.' );
            
            done();
        });
    });
    
    it('creating (cloudspokes) user should be successful', function(done) {
        // cloudspokes user
        var query_string = "username=" + test_user.username + "&"
        				 + "password=" + test_user.password + "&"
        				 + "email=" + test_user.username + "@test.com";
        
    	request.post(setup.testUrl + '/accounts/create?' + query_string, function (err, response, body) {
            body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            // properties that should not be included...
            assert.notProperty( body, 'password' );
            assert.notProperty( body, 'memberid' );
            
            // properties that should be in the response...
            assert.property( body, 'sfdc_username' );
            
            // properties that should be in the response with exact values...
            assert.propertyVal( body, 'success', true );
            assert.propertyVal( body, 'username', test_user.username );
            assert.propertyVal( body, 'message', 'Member created successfully.' );
            
            done();
        });
    });
    
    it('creating same user should fail', function(done){
    	var query_string = "username=" + test_user.username + "&"
        				 + "password=" + test_user.password + "&"
        				 + "email=" + test_user.username + "@test.com";
        
    	request.post(setup.testUrl + '/accounts/create?' + query_string, function (err, response, body) {
    		body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            // properties that should be in the response with exact values...
            assert.propertyVal( body, 'success', false );
            assert.propertyVal( body, 'message', 'Username '+ test_user.username +' is not available.' );
            
    		done();
    	});
    });
    
    it('creating (third-party) user without provider_username should fail', function(done) {
    	// cloudspokes user
        var query_string = "username=" + test_provider.username + "&"
        				 + "password=" + test_provider.password + "&"
        				 + "email=" + test_provider.username + "@test.com&"
        				 + "provider=" + test_provider.provider;
        
        request.post(setup.testUrl + '/accounts/create?' + query_string, function (err, response, body) {
            body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            // properties that should be in the response with exact values...
            assert.propertyVal( body, 'success', false );
            assert.propertyVal( body, 'message', 'Third parties need to provide provider_username.' );
			
            done();
        });
    });
    
    it('creating (third-party) user should be successful', function(done) {
    	// cloudspokes user
        var query_string = "username=" + test_provider.username + "&"
        				 + "password=" + test_provider.password + "&"
        				 + "email=" + test_provider.username + "@test.com&"
        				 + "provider=" + test_provider.provider + "&"
        				 + "provider_username=" + test_provider.provider_username;
        
        request.post(setup.testUrl + '/accounts/create?' + query_string, function (err, response, body) {
            body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            // properties that should not be included...
            assert.notProperty( body, 'password' );
            assert.notProperty( body, 'memberid' );
            
            // properties that should be in the response...
            assert.property( body, 'sfdc_username' );
            
            // properties that should be in the response with exact values...
            assert.propertyVal( body, 'success', true );
            assert.propertyVal( body, 'username', test_provider.username );
            assert.propertyVal( body, 'message', 'Member created successfully.' );
            
            done();
        });
    });
});
