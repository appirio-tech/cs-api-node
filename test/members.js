var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js'),
    _       = require("underscore")

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

describe('GET /members/:membername/challenges/past', function () {
  before(function (done) {
      setup.init(done);
  });

  it(membername + ' should have at least 1 past challenge', function (done) {
      request.get(setup.testUrl + '/members/' + membername + '/challenges/past', function (err, response, body) {
          body = JSON.parse(body);
          assert.ok(body.response.total > 0);
          done();
      });
  });

});

describe('GET /members/search', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/members/search?keyword=jeff', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.count, 3);
            done();
        });
    });
    it('should be empty', function (done) {
        request.get(setup.testUrl + '/members/search?keyword=blahblah', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.error, "not_found");
            done();
        });
    });
});


describe("GET /members/:membername/referrals", function() {
    before(function (done) {
        setup.init(done);    
    });

    describe("When the member has 1 referrals", function() {
        beforeEach(function(done) {
            nock('https://cs9.salesforce.com:443')
                .get('/services/apexrest/v.9/referrals/mess')
                .reply(200, "[{\"signup_date\":\"2013-07-21T05:33:30.000Z\",\"referral_money\":0.000,\"referral_id\":\"a11K0000000ih7MIAQ\",\"profile_pic\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\",\"membername\":\"GHUASQ34\",\"first_year_money\":0.00}]", { date: 'Sun, 22 Sep 2013 13:34:32 GMT',
                'content-type': 'application/json;charset=UTF-8',
                'transfer-encoding': 'chunked' });
        
            done();
        });

        it('returned count is 1', function (done) {
            request.get(setup.testUrl + '/members/mess/referrals', function (err, response, body) {
                // console.log(body)
                body = JSON.parse(body);
                assert.equal(body.count, 1);
                done();
            });
        });

        it("returned object has fields", function(done) {
            request.get(setup.testUrl + '/members/mess/referrals', function (err, response, body) {
                body = JSON.parse(body);
                assert.propertyVal(body.response, "signup_date");
                assert.propertyVal(body.response, "referral_money");
                assert.propertyVal(body.response, "referral_id");
                assert.propertyVal(body.response, "profile_pic");
                assert.propertyVal(body.response, "membername");
                assert.propertyVal(body.response, "first_year_money");
                done();
            });            
        })

    });

    describe("when the member has no refferal", function() {
        beforeEach(function(done) {
            nock('https://cs9.salesforce.com:443')
              .get('/services/apexrest/v.9/referrals/jeffdonthemic')
              .reply(200, "[]", { date: 'Sun, 22 Sep 2013 13:57:14 GMT',
              'content-type': 'application/json;charset=UTF-8',
              'transfer-encoding': 'chunked' });            

            done();
        });

        it('it returns an empty array', function (done) {
            request.get(setup.testUrl + '/members/jeffdonthemic/referrals', function (err, response, body) {
                body = JSON.parse(body);
                assert.isArray(body.response);
                assert.equal(body.count,0);
                done();
            });
        });
    })
});