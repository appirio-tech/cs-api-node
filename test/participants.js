var request = require('request'),
    assert  = require('chai').assert,
    setup   = require('./setup.js');

describe('GET /participants/:membername/:challenge_id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return 1 result', function (done) {
        request.get(setup.testUrl + '/participants/jeffdonthemic/22', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('GET /participants/:participant_id"', function () {
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

describe('PUT /participants/:membername/:challenge_id/deliverable"', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should update deliverable successfully', function (done) {
        var params = {
          data: "challenge_participant__c=a0AK000000BTelZMAT&url__c=https%3A%2F%2Fs3.amazonaws.com%2Fcs-sandbox%2Fchallenges%2F65%2Fjeffdonthemic%2Fcx-report.pdf&type__c=Code&language__c=Apex%20%2F%20Visualforce&comments__c=test"
        };
        request.put({ url: setup.testUrl + '/participants/jeffdonthemic/22/deliverable', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('POST /participants/:membername/:challenge_id"', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should create a new participant record successfully', function (done) {
        var params = {
          fields: "status__c=Watching&username=jeffdonthemic&challengeid=66"
        };
        request.post({ url: setup.testUrl + '/participants/jeffdonthemic/66', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});

describe('PUT /participants/:membername/:challenge_id"', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should update participant record successfully', function (done) {
        var params = {
          fields: "{\"status__c\":\"Registered\", \"challengeid\":\"22\"}"
        };
        request.put({ url: setup.testUrl + '/participants/jeffdonthemic/66', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response);
            done();
        });
    });
});
