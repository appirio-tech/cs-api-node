var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('GET /messages/:id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return 1 message', function (done) {
        request.get(setup.testUrl + '/messages/a1FK0000004Ey9xMAC', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('GET /messages/inbox/:membername', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return at least 1 message', function (done) {
        request.get(setup.testUrl + '/messages/inbox/jeffdonthemic', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});
