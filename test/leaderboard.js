var request = require('request'),
    assert  = require('chai').assert,
    _       = require('underscore'),
    setup   = require('./setup.js');

describe('leaderboard', function () {
    before(function (done) {
        setup.init(done);
    });

    it('no time period should be empty', function (done) {
        request.get(setup.testUrl + '/leaderboard', function (err, response, body) {
            body = JSON.parse(body);
            for (var key in body.response) {
                assert.ok(body.response[key].length > 0);
            }
            done();
        });
    });

    it('limit parameter should work', function (done) {
        request.get(setup.testUrl + '/leaderboard?limit=1', function (err, response, body) {
            body = JSON.parse(body);
            for (var key in body.response) {
                assert.equal(body.response[key].length, 1);
            }
            done();
        });
    });

    describe('referrals', function () {
        describe('list', function () {
            it('should not be empty', function (done) {
                request.get(setup.testUrl + '/leaderboard/referrals', function (err, response, body) {
                    body = JSON.parse(body);
                    assert.ok(body.response);
                    assert.ok(_.isArray(body.response) && body.response.length > 0 ||
                              _.isObject(body.response) && !_.isArray(body.response));
                    done();
                });
            })
        });
    });
});