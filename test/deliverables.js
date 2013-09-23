var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('GET /participants/:membername/:challenge_id/submission/:submission_id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return at least one submission', function (done) {
        request.get(setup.testUrl + '/participants/jeffdonthemic/25/submission/a0DK000000B7ekAMAR', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('GET /participants/:membername/:challenge_id/current_submissions', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return at least one submission', function (done) {
        request.get(setup.testUrl + '/participants/jeffdonthemic/22/current_submissions', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('GET /participants/:membername/:challenge_id/deliverables', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return at least one deliverable', function (done) {
        request.get(setup.testUrl + '/participants/jeffdonthemic/22/deliverables', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.length > 0);
            done();
        });
    });
});
