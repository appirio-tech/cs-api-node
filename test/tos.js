var request = require('request'),
    assert  = require('chai').assert,
    _       = require('underscore'),
    setup   = require('./setup.js');

describe('tos', function () {
    before(function (done) {
        setup.init(done);
    });

    var lastid;

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/tos', function (err, response, body) {
            body = JSON.parse(body);

            // It returns an object if it finds only one TOS
            // and an array if it finds more than one TOS

            var isArrayOK = _.isArray(body) && body.length > 0;
            var isObjectOK = _.isObject(body) && !_.isArray(body);

            assert.ok(isArrayOK || isObjectOK);

            if (isArrayOK) {
                lastid = body[0].id;
            } else if (isObjectOK) {
                lastid = body.id;
            }
            done();
        });
    });

    it('id parameter should work', function (done) {
        request.get(setup.testUrl + '/tos/' + lastid, function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(_.isObject(body) && !_.isArray(body) && body.id === lastid);
            done();
        });
    });
});