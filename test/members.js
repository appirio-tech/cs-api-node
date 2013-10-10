var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js'),
    _       = require("underscore");

var membername = 'jeffdonthemic';
var nock = require('nock');

describe('GET /members/:membername/payments', function () {
    before(function (done) {
        setup.init(done);
    });

    it(membername + ' has 3 payments', function (done) {
        request.get(setup.testUrl + '/members/' + membername + '/payments', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.count, 3);
            done();
        });
    });

    it("sorts by money when order_by is money", function(done) {
        request.get(setup.testUrl + '/members/' + membername + '/payments?order_by=money', function (err, response, body) {
            body = JSON.parse(body);
            moneys = _.map(body.response, function(p){ return p.money });
            assert.deepEqual(moneys, [100, 550, 1000]);
            done();
        });
    });
});

describe('GET /members/:membername/challenges', function () {
  before(function (done) {
      setup.init(done);
  });

  it(membername + ' should have at least 1 active challenge', function (done) {
      request.get(setup.testUrl + '/members/' + membername + '/challenges', function (err, response, body) {
          body = JSON.parse(body);
          assert.ok(Object.keys(body.response.active).length > 0);
          done();
      });
  });


});

describe('GET /members/search', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/members/search?q=jeff', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.count > 1);
            done();
        });
    });
    it('should be empty', function (done) {
        request.get(setup.testUrl + '/members/search?q=blahblah', function (err, response, body) {
            body = JSON.parse(body);
            assert.isArray( body.response );
            assert.equal(body.count, 0);
            done();
        });
    });
});


describe("GET /members/:membername/referrals", function() {
    before(function (done) {
        setup.init(done);    
    });

    describe("When the member has 1 referrals", function() {

        it('returned count is 1', function (done) {
            request.get(setup.testUrl + '/members/jeffdonthemic/referrals', function (err, response, body) {
                // console.log(body)
                body = JSON.parse(body);
                assert.lengthOf(body.response, 1)
                assert.equal(body.count, 1);
                done();
            });
        });

        it("returned object has fields", function(done) {
            request.get(setup.testUrl + '/members/jeffdonthemic/referrals', function (err, response, body) {
                body = JSON.parse(body);
                var referral = body.response[0];
                assert.propertyVal(referral, "signup_date");
                assert.propertyVal(referral, "referral_money");
                assert.propertyVal(referral, "referral_id");
                assert.propertyVal(referral, "profile_pic");
                assert.propertyVal(referral, "membername");
                assert.propertyVal(referral, "first_year_money");
                done();
            });            
        });

    });

    describe("when the member has no refferal", function() {
        it('it returns an empty array', function (done) {
            request.get(setup.testUrl + '/members/mess/referrals', function (err, response, body) {
                body = JSON.parse(body);
                assert.isArray(body.response);
                assert.equal(body.count,0);
                done();
            });
        });
    })
});

describe('PUT /members/:membername', function () {
    before(function (done) {
        setup.init(done);
    });
    
    it('update with invalid fields JSON should fail', function(done) {
    	var query_string = 'fields={"key":wrong"}';
        
    	request.put(setup.testUrl + '/members/' + membername + '?' + query_string,
    		function (err, response, body) {
            	body = JSON.parse(body);
            	
            	assert.propertyVal(body, 'error', 'SyntaxError: Unexpected token w');
            	
	    		done();
    		});
    });
    
    it('update with fields not on the white-list should fail', function(done) {
    	var fields = { not_on_whitelist_key : "any value" };
    	
    	var query_string = "fields=" + JSON.stringify(fields);
        
    	request.put(setup.testUrl + '/members/' + membername + '?' + query_string,
    		function (err, response, body) {
            	body = JSON.parse(body);
            	
            	assert.propertyVal(body, 'error', 'not_found');
  				assert.propertyVal(body, 'error_description', 'The requested resource could not be found!');
  				
	    		done();
    		});
    });
    
    it('update with invalid email should fail', function(done) {
    	var fields = { email: "notavalidemail" };
    	
    	var query_string = "fields=" + JSON.stringify(fields);
        
    	request.put(setup.testUrl + '/members/' + membername + '?' + query_string,
    		function (err, response, body) {
            	body = JSON.parse(body);
            	
            	assert.propertyVal(body, 'error', 'Error: Invalid email.');
            	
	    		done();
    		});
    });
    
    it('updating should be successful', function(done) {
    	var fields = { jabber: "jabber for user" };
    	
    	var query_string = "fields=" + JSON.stringify(fields);
        
    	request.put(setup.testUrl + '/members/' + membername + '?' + query_string,
    		function (err, response, body) {
            	body = JSON.parse(body);
            	
            	assert.deepEqual(body.response, fields);
            	
	    		done();
    		});
    });
});
