var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js'),
    _       = require("underscore")

var membername = 'jeffdonthemic';

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
