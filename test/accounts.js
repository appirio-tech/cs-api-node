var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('accounts', function () {
    before(function (done) {
        setup.init(done);
    });
    
    it('should be array, should have "count" elements', function (done) {
        request.get(setup.testUrl + '/accounts/port2node/preferences', function (err, response, body) {
            body = JSON.parse(body);
            // simplify reference to response...
            body = body.response;
            
            assert.property( body, 'response' );
            assert.property( body, 'count' );
            
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
