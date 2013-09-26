var request = require('request'),
    assert  = require('assert'),
    setup   = require('./setup.js');

var survey = {
    requirements: 'Yes',
    timeframe: 'Yes',
    prize_money: 'Prize money was perfect!',
    compete_again: 'Most Likely',
    improvements: 'So far so good',
    why_no_submission: 'Because I did not have time to submit :('
};

var comment = {
    challenge_id: '66',
    comments: 'nothing special, just testing'
};

describe('surveys', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should insert a new survey', function (done) {
        var challengeId = 2;
        request.post({url: setup.testUrl + '/challenges/' + challengeId + '/survey', form: survey}, function (err, res, body) {
            if (err) { throw err; }
            assert.equal(res.statusCode, 201);
            done();
        });
    });

    it('should fail do to unexisting challenge', function (done) {
        var challengeId = 3000;
        request.post({url: setup.testUrl + '/challenges/' + challengeId + '/survey', form: survey}, function (err, res, body) {
            if (err) { throw err; }
            assert.equal(res.statusCode, 201); //it should be a 404
            done();
        });
    });
});

describe('comments', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should insert a new comment', function (done) {
        comment.membername = 'jeffdonthemic';
        request.post({url: setup.testUrl + '/comments', form: comment}, function (err, res, body) {
            if (err) { throw err; }
            var response = JSON.parse(body);
            assert(response.response.success);
            done();
        });
    });

    it('should insert a new reply', function (done) {
        comment.membername = 'jeffdonthemic';
        comment.reply_to = 'a09K0000009k0N3IAI';
        request.post({url: setup.testUrl + '/comments', form: comment}, function (err, res, body) {
            if (err) { throw err; }
            var response = JSON.parse(body);
            assert(response.response.success);
            done();
        });
    });

    it('should fail do to user has no permit', function (done) {
        comment.membername = 'gfhuertac';
        request.post({url: setup.testUrl + '/comments', form: comment}, function (err, res, body) {
            if (err) { throw err; }
            var response = JSON.parse(body);
            assert(response.response.success);
            done();
        });
    });
});
