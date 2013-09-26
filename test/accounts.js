var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

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
    
    it('each preference element should be well-formed', function(done) {
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

describe('PUT /accounts/:membername/marketing', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should update marketing info successfully', function (done) {
        var reqBody = {
          campaign_source: "source",
          campaign_medium: "medium",
          campaign_name: "name"
        };
        request.put({ url: setup.testUrl + '/accounts/chang/marketing', form: reqBody },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});

describe('PUT /accounts/:membername/referred_by', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should set referral by name', function (done) {
        var reqBody = {
          referral_id_or_membername: "jeffdonthemic"
        };
        request.put({ url: setup.testUrl + '/accounts/chang/referred_by', form: reqBody },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });

    it('should set referral by id', function (done) {
        var reqBody = {
          referral_id_or_membername: "a11K0000000ih7MIAQ"
        };
        request.put({ url: setup.testUrl + '/accounts/chang/referred_by', form: reqBody },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});

describe('PUT /accounts/update_password_token/:membername', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should set token successfully', function (done) {
        var params = {
          token: "123456"
        };
        request.put({ url: setup.testUrl + '/accounts/update_password_token/chang', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});

describe('PUT /accounts/change_password_with_token/:membername', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should update password successfully', function (done) {
        var params = {
          token: "123456",
          new_password: "mocha123"
        };
        request.put({ url: setup.testUrl + '/accounts/change_password_with_token/chang', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});
