var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js'),
    _       = require("underscore")



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