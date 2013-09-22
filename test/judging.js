var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('judging', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/judging', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.length > 0);
            done();
        });
    });

    describe('scorecard', function () {
        describe('fetch by id and reviewer name', function () {
            it ('should not be empty', function (done) {
                //Hardcoded values - once the appropriate routes get in place,
                //this needs to change
                var userId    = 'a0AK000000BhvmrMAB',
                    judgeName = 'port2node';

                var url = setup.testUrl + '/judging/scorecard/' + userId + '?judge_membername=' + judgeName;

                request.get(url, function (err, response, body) {
                    body = JSON.parse(body);
                    assert.ok(body.response.length > 0);
                    done();
                });
            });
        });
    });

    describe('outstanding', function () {
        describe('fetch by judge name', function () {
            it('should not be empty', function (done) {
                //Hardcoded values - once the appropriate routes get in place,
                //this needs to change
                var judgeName = 'port2node';

                var url = setup.testUrl + '/judging/outstanding/' + judgeName;

                request.get(url, function (err, response, body) {
                    body = JSON.parse(body);
                    assert.ok(body.response.length > 0);
                    done();
                });
            });
        });
    });
});