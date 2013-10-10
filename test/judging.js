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
                var userId    = 'a0AJ0000006XnML', // participant id
                    judgeName = 'mess';

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
                var judgeName = 'mess';
                var url = setup.testUrl + '/judging/outstanding/' + judgeName;
                request.get(url, function (err, response, body) {
                    body = JSON.parse(body);
                    assert.ok(body.response.length > 0);
                    done();
                });
            });
        });
    });

    describe('POST /judging', function () {
        before(function (done) {
            setup.init(done);
        });

        it('should add a member as a judge successfully or return an "already added" message', function (done) {
            var reqBody = {
              challenge_id: "2",
              membername: "apextestmember"
            };
            request.post({ url: setup.testUrl + '/judging', form: reqBody },  function (err, response, body) {
                body = JSON.parse(body);
                assert.ok(body.response.success || body.response.message == "Unable to add you as a judge. You are already a judge for this challenge.");
                done();
            });
        });
    });

    describe('PUT /judging/scorecard/:id', function () {
        before(function (done) {
            setup.init(done);
        });

        it('should save the scorecard successfully', function (done) {
            var reqBody = {
              answers: "a0LK0000004avFoMAI%3D4%26a0LK0000004avFpMAI%3D3%26a0LK0000004avFqMAI%3D2%26a0LK0000004avFrMAI%3D3%26a0LK0000004avFsMAI%3D1%26a0LK0000004avFtMAI%3D4",
              comments: "a0LK0000004avFoMAI%3DThis%2Bis%2Bmy%2Bfirst%2Bcomment%2521%2521%26a0LK0000004avFpMAI%3Dasdfa%2Bds%2Bdfadsf%26a0LK0000004avFqMAI%3Dsdfafasf%2Ba%2Bsadf%2Basdf%2Ba%26a0LK0000004avFrMAI%3Dadsf%26a0LK0000004avFsMAI%3DAnother%2Bcomment%2521%2521%26a0LK0000004avFtMAI%3Dadsfa",
              options: "delete_scorecard%3D%26judge_membername%3Djeffdonthemic%26scored%3Dfalse"
            };
            request.put({ url: setup.testUrl + '/judging/scorecard/a0AK000000BhvmmMAB', form: reqBody },  function (err, response, body) {
                body = JSON.parse(body);
                assert.ok(body.response.success);
                done();
            });
        });
    });
});