var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('challenges', function () {
    before(function (done) {
        setup.init(done);
    });

    describe('fetch by id', function () {
        //Hardcoded value - once the appropriate routes get in place,
        //this needs to change
        var id = 'a0GK0000008OIRAMA4';

        it('should not be empty', function (done) {
            request.get(setup.testUrl + '/challenges/' + id, function (err, response, body) {
                body = JSON.parse(body);
                assert.ok(body.response);
                done();
            });
        });

        it('should return the appropriate keys when user is admin', function (done) {
            request.get(setup.testUrl + '/challenges/' + id + '?admin=true', function (err, response, body) {
                body = JSON.parse(body);

                assert.ok(body.response);

                assert.ok(body.response.challenge_reviewers__r);
                assert.ok(body.response.challenge_comment_notifiers__r);
                assert.ok(body.response.assets__r);

                done();
            });
        });
    });
});