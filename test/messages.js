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

describe('GET /messages/to/:membername', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return at least 1 message', function (done) {
        request.get(setup.testUrl + '/messages/to/jeffdonthemic', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('GET /messages/from/:membername', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return at least 1 message', function (done) {
        request.get(setup.testUrl + '/messages/from/mess', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('POST /messages', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should send a message successfully', function (done) {
        var reqBody = {
          from: "mess",
          to: "jeffdonthemic",
          subject: "Mocha Test subject",
          body: "Mocha Test body"
        };
        request.post({ url: setup.testUrl + '/messages', form: reqBody },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});

describe('POST /messages/:id/reply', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should send a reply message successfully', function (done) {
        var reqBody = {
          from: "apextestuser",
          body: "Mocha Test reply body"
        };
        request.post({ url: setup.testUrl + '/messages/a1GJ0000000tftoMAA/reply', form: reqBody },  function (err, response, body) {
            body = JSON.parse(body);
            console.log(body);
            assert.ok(body.response.success);
            done();
        });
    });
});

describe('PUT /messages/:id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should update message successfully', function (done) {
        var reqBody = {
          to: "jeffdonthemic",
          from: "chang",
          subject: "Mocha Test update",
          body: "Mocha Test update"
        };
        request.put({ url: setup.testUrl + '/messages/a1FK0000004Jy4dMAC', form: reqBody },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});
