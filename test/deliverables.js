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

describe('GET /participants/:membername/:challenge_id/delete_submission_url_file', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should delete submission successfully', function (done) {
        request.get(setup.testUrl + '/participants/jeffdonthemic/25/delete_submission_url_file?submission_id=a0DK000000B7ekAMAR', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});

describe('POST /participants/:membername/:challenge_id/submission_url_file', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should create submission successfully', function (done) {
        request.post(setup.testUrl + '/participants/mess/20/submission_url_file', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});
