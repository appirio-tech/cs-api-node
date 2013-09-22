var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js'),
    _       = require("underscore")

describe('GET /members/:membername/payments', function () {
    before(function (done) {
        setup.init(done);
    });

    it('jeffdonthemic has 3 payments', function (done) {
        request.get(setup.testUrl + '/members/jeffdonthemic/payments', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.count, 3);
            done();
        });
    });

    it("sorts by money when order_by is money", function(done) {
        request.get(setup.testUrl + '/members/jeffdonthemic/payments?order_by=money', function (err, response, body) {
            body = JSON.parse(body);
            moneys = _.map(body.response, function(p){ return p.money });
            assert.deepEqual(moneys, [100, 550, 1000]);
            done();
        });        
    });
});

describe("GET /members/:membername/referrals", function() {
    before(function (done) {
        setup.init(done);
    });

    it('mess has 1 referrals', function (done) {
        request.get(setup.testUrl + '/members/mess/referrals', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.count, 1);
            done();
        });
    });

    it('jeffdonthemic does not have referrals', function (done) {
        request.get(setup.testUrl + '/members/jeffdonthemic/referrals', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.error, "not_found");
            done();
        });
    });

});