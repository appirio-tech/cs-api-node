var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('GET /participants/:membername/:challenge_id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return 1 result', function (done) {
        request.get(setup.testUrl + '/participants/apextestmember/2', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('GET /participants/:participant_id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return 1 result', function (done) {
        request.get(setup.testUrl + '/participants/a0AK000000BhvmmMAB', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('POST /participants/:membername/:challenge_id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should create a new participant record successfully', function (done) {
        var params = {
          fields: "status__c=Watching&username=apextestmember&challengeid=2"
        };
        request.post({ url: setup.testUrl + '/participants/apextestmember/2', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('PUT /participants/:membername/:challenge_id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should update participant record successfully', function (done) {
        var params = {
          fields: "{\"status__c\":\"Registered\", \"challengeid\":\"2\"}"
        };
        request.put({ url: setup.testUrl + '/participants/apextestmember/2', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});
