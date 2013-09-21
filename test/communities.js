var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('communities', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/communities', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.length > 0);
            done();
        });
    });
});
