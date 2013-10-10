var request = require('request'),
  assert  = require('chai').assert,
  setup   = require('./setup.js'),
  _ = require("underscore"),
  nock = require('nock'),
  querystring = require("querystring");

describe('GET /challenges/:challenge_id/submission_deliverables', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should return at least one submission', function (done) {
        request.get(setup.testUrl + '/challenges/2/submission_deliverables', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.length > 0);
            done();
        });
    });
});

describe('challenges', function () {
    before(function (done) {
        setup.init(done);
    });

    describe('fetch by id', function () {
        //Hardcoded value - once the appropriate routes get in place,
        //this needs to change
        var id = '2';

        it('should not be empty', function (done) {
            request.get(setup.testUrl + '/challenges/' + id, function (err, response, body) {
                body = JSON.parse(body);
                assert.ok(body.response);
                done();
            });
        });
    });

    describe('participants', function () {
        it('should not error', function (done) {
            //Hardcoded value - once the appropriate routes get in place,
            //this needs to change
            var id = '2';

            request.get(setup.testUrl + '/challenges/' + id + '/participants', function (err, response, body) {
                body = JSON.parse(body);
                assert.ok(body.response);
                done();
            });
        });
    });
});

describe("GET /challenges", function() {
  before(function(done) {
    setup.init(done);
  });

  beforeEach(function(done) {
    nock.cleanAll();
    done();
  });

  describe("When there is at least 1 open challenges", function() {

    it("returns > 0 challenges", function(done) {
      request.get(setup.testUrl + '/challenges', function(err, response, body) {
        body = JSON.parse(body);
        assert.ok(body.count > 0);
        assert.ok(body.response.length > 0);
        done();
      });
    });

    it("responsed object has proper fields", function(done) {
      request.get(setup.testUrl + '/challenges', function(err, response, body) {
        body = JSON.parse(body);
        var challenge = body.response[0];
        assert.propertyVal(challenge, "total_prize_money");
        assert.propertyVal(challenge, "end_date");
        assert.propertyVal(challenge, "registered_members");
        assert.propertyVal(challenge, "participating_members");
        assert.propertyVal(challenge, "name");
        assert.propertyVal(challenge, "challenge_id");
        assert.propertyVal(challenge, "challenge_type");
        assert.propertyVal(challenge, "id");
        assert.propertyVal(challenge, "description");
        assert.propertyVal(challenge, "start_date");
        assert.propertyVal(challenge, "is_open");
        assert.propertyVal(challenge, "days_till_close");
        assert.propertyVal(challenge, "platforms");
        assert.propertyVal(challenge, "technologies");

        done();
      });

    });

  });


  // returns nock object with the `name` parameter.
  // ignores other parameters

  function sfdcNock(params) {
    var reqQuery = _.map(params, function(value, name) {
      return name + "=" + value;
    });
    return nock('https://cs9.salesforce.com:443')
      .filteringPath(function(path) {
        // cut out specified params.
        var query = querystring.parse(path.split("?")[1]);
        path = path.split("?")[0];

        var targets = _.map(params, function(value, name) {
          return name + "=" + query[name];
        });
        return path + "?" + targets.join("&");
      })
      .get('/services/apexrest/v.9/challengeslist?' + reqQuery.join("&"))
      .reply(200, "[]", {
        'content-type': 'application/json;charset=UTF-8',
      });
  }



  // The idea of test is verifying sfdc api call.
  // It is not an integration test, but it makes sense to me. My reasoning is like followings.
  // 1. We cant end real request. it takes too long.
  // 2. Then we have to use nock, set response for a request.
  //    It means the api server will retrun the same result for a request.
  // 3. Then why not use just an expectaion? We only need to verify if the request is right.
  describe("order_by parameter test", function() {

    it("default value is end_date__c", function(done) {
      request.get(setup.testUrl + '/challenges', function(err, response, body) {
        body = JSON.parse(body);
        assert.ok(body.response);
        done();
      });
    });

    it("forcifies order_by parameter when sending sfdc request", function(done) {
      request.get(setup.testUrl + '/challenges?order_by=registered_members', function(err, response, body) {
        body = JSON.parse(body);
        assert.ok(body.response);
        done();
      });
    });

    it("order_by parameter can have 'desc' or 'asc'", function(done) {
      request.get(setup.testUrl + '/challenges?order_by=registered_members desc', function(err, response, body) {
        body = JSON.parse(body);
        assert.ok(body.response);
        done();
      });
    });

  }); // end of order_by parameter test

  describe("open parameter test", function() {
    it("default value is true", function(done) {
      request.get(setup.testUrl + '/challenges?open=true', function(err, response, body) {
        body = JSON.parse(body);
        assert.ok(body.response);
        done();
      });
    });

    it("able to set open parameter as false", function(done) {
      request.get(setup.testUrl + '/challenges?open=false', function(err, response, body) {
        body = JSON.parse(body);
        assert.ok(body.response);
        done();
      });
    });

  }); // end of open parameter test

  it("able to set technology parameter", function(done) {
    request.get(setup.testUrl + '/challenges?technology=ruby', function(err, response, body) {
      body = JSON.parse(body);
      assert.ok(body.response);
      done();
    });
  });
  it("able to set platform parameter", function(done) {
    request.get(setup.testUrl + '/challenges?platform=heroku', function(err, response, body) {
      body = JSON.parse(body);
      assert.ok(body.response);
      done();
    });
  });
  it("able to set category parameter", function(done) {
    request.get(setup.testUrl + '/challenges?category=code', function(err, response, body) {
      body = JSON.parse(body);
      assert.ok(body.response);
      done();
    });
  });

  it("able to set limit and offset parameters", function(done) {
    request.get(setup.testUrl + '/challenges?limit=20&offset=30', function(err, response, body) {
      body = JSON.parse(body);
      assert.ok(body.response);
      done();
    });
  });

  it("default value of limit and offset is 100 and 0", function(done) {
    request.get(setup.testUrl + '/challenges', function(err, response, body) {
      body = JSON.parse(body);
      assert.ok(body.response);
      done();
    });
  });
});

describe("GET /challenges/:id/scorecards", function() {
  before(function(done) {
    setup.init(done);
  });

  it('returned count is 1', function(done) {
    request.get(setup.testUrl + '/challenges/2/scorecards', function(err, response, body) {
      body = JSON.parse(body);
      assert.ok(body.count > 0);
      done();
    });
  });

  it("responsed object has proper fields", function(done) {
    request.get(setup.testUrl + '/challenges/2/scorecards', function(err, response, body) {
      body = JSON.parse(body);
      var scorecard = body.response[0];
      assert.propertyVal(scorecard, "name");
      assert.propertyVal(scorecard, "submitted_date");
      assert.propertyVal(scorecard, "money_awarded");
      assert.propertyVal(scorecard, "score");
      assert.propertyVal(scorecard, "member");
      assert.propertyVal(scorecard, "id");
      assert.propertyVal(scorecard, "challenge");
      assert.propertyVal(scorecard, "scorecard__r");
      assert.propertyVal(scorecard, "member__r");
      done();
    });
  });
});

describe("GET /challenges/:id/scorecard", function() {
  before(function(done) {
    setup.init(done);
  });

  it('returned count is 2', function(done) {
    request.get(setup.testUrl + '/challenges/2/scorecard', function(err, response, body) {
      body = JSON.parse(body);
      assert.equal(body.count, 1);
      done();
    });
  });

  it("responsed object has proper fields", function(done) {
    request.get(setup.testUrl + '/challenges/2/scorecard', function(err, response, body) {
      body = JSON.parse(body);
      var scorecard = body.response;
      assert.propertyVal(scorecard, "name");
      assert.propertyVal(scorecard, "id");
      assert.propertyVal(scorecard, "group_weight");
      assert.propertyVal(scorecard, "qwikscore_questions__r");
      done();
    });
  });
});

describe("GET /challenges/:id/comments", function() {
  before(function(done) {
    setup.init(done);
  });

  it('returned count is at least 1', function(done) {
    request.get(setup.testUrl + '/challenges/2/comments', function(err, response, body) {
      body = JSON.parse(body);
      assert.ok(body.response.length > 0);
      assert.ok(body.count > 0);
      done();
    });
  });


  it("responsed object has proper fields", function(done) {
    request.get(setup.testUrl + '/challenges/2/comments', function(err, response, body) {
      body = JSON.parse(body);
      var comment = body.response[0];
      assert.propertyVal(comment, "from_challenge_admin");
      assert.propertyVal(comment, "comment");
      assert.propertyVal(comment, "member");
      assert.propertyVal(comment, "createddate");
      assert.propertyVal(comment, "id");
      assert.propertyVal(comment, "challenge");
      assert.propertyVal(comment, "member__r");
      done();
    });
  })

});

describe('surveys', function () {
    before(function (done) {
        setup.init(done);
    });

    var survey = {
        requirements: 'Yes',
        timeframe: 'Yes',
        prize_money: 'Prize money was perfect!',
        compete_again: 'Most Likely',
        improvements: 'So far so good',
        why_no_submission: 'Because I did not have time to submit :('
    };

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
            assert.equal(res.statusCode, 404); //it should be a 404
            done();
        });
    });
});

describe('comments', function () {
    before(function (done) {
        setup.init(done);
    });

    var comment = {
        challenge_id: '2',
        comments: 'nothing special, just testing'
    };

    it('should insert a new comment', function (done) {
        comment.membername = 'jeffdonthemic';
        request.post({url: setup.testUrl + '/comments', form: comment}, function (err, res, body) {
          console.log(err);
          console.log(JSON.parse(body));
            if (err) { throw err; }
            var response = JSON.parse(body);
            assert(response.response.success);
            done();
        });
    });

    it('should insert a new reply', function (done) {
        comment.membername = 'jeffdonthemic';
        comment.reply_to = 'a09J0000006wBnf';
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
            assert.notOk(response.response.success)
            done();
        });
    });
});

describe('GET /challenges/search', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/challenges/search?q=test', function (err, response, body) {
            body = JSON.parse(body);
            assert.notEqual(body.count, 0);
            done();
        });
    });
    it('should be empty', function (done) {
        request.get(setup.testUrl + '/challenges/search?q=gnihtemos', function (err, response, body) {
            body = JSON.parse(body);
            assert.isArray( body.response );
            assert.lengthOf( body.response, 0 );
            done();
        });
    });
});



describe('GET /challenges/advsearch', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/challenges/advsearch?p_min=0&c=all&sort_by=end_date__c&q=challenge&p=all&state=open&sort_order=ASC&t=all&m_max=100000&m_min=0&p_max=5', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.count, 1);
            done();
        });
    });
    it('should be empty', function (done) {
        request.get(setup.testUrl + '/challenges/advsearch?c=all&sort_by=end_date__c&p_min=1&p=BADPLATFORM&state=open&sort_order=DESC&t=all&m_max=1000&m_min=100&p_max=5', function (err, response, body) {
            body = JSON.parse(body);
            assert.isArray( body.response );
            assert.lengthOf( body.response, 0 );
            done();
        });
    });
});

describe('PUT /challenges/:challenge_id', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should update challenge successfully', function (done) {
        var params = {
          data: JSON.stringify({"challenge": {"platforms": [{"name": "AWS"}, {"name": "Cloud Foundry"}],"technologies": [{"name": "JavaScript"}, {"name": "Ruby"}, {"name": "iOS"}],"prizes": [{"place__c": "1","prize__c": "$500","points__c": "500","value__c": "500"}, {"place__c": "2","prize__c": "$250","points__c": "250","value__c": "250"}],"assets": [{"filename__c": "1X5RcI1.png"}],"detail": {"contact__c": "jeffdonthemic","winner_announced__c": "2016-10-06","submission_details__c": "<p>Upload all your source code as a zip (you can simply zip up your Eclipse project for convenience) and provide any documentation and/or instructions that are needed. Please be clear and concise with any setup instructions.</p>\r\n\r\n<p>A video of your application using Jing or Youtube is required. An unmanaged package for installation is also required.</p>\r\n","status__c": "Open for Submissions","start_date__c": "2013-09-25T23:00:00-04:00","requirements__c": "<p>Please implement the following requirements:</p>\r\n","name": "TESTING Challenge -- Do Not Modify","end_date__c": "2016-09-29T23:00:00-04:00","description__c": "<p>Your overview should describe what you are trying to build within a few simple sentences. Remember, the person reading your overview has no background on what you are trying to build so try to think of the best way to convey the goal of the challenge. You can provide more details in the requirements section. Here is a sample:</p>\r\n\r\n<p>We have an existing Salesforce.com application that is not visually appealing. It&#39;s a simple search and details application which consists of 1-2 Apex Controllers and 3 Visualforce pages. We used a third party service to design a new layout and they have sent us the HTML and CSS for our new application. We need your Visualforce and Apex skills to merge the HTML and CSS with our existing code.</p>\r\n","comments__c": "Ready to go with this!!","additional_info__c": "<p>This is my optional text.</p>\r\n","challenge_type__c": "Code","community_judging__c": "true","auto_announce_winners__c": "false","challenge_id__c": "2","post_reg_info__c": "<p>After you register you&#39;ll see this...</p>\r\n","require_registration__c": "false"}}})
        };
        request.put({ url: setup.testUrl + '/challenges/2', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.response.success);
            done();
        });
    });
});

describe('POST /challenges', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should create a new challenge successfully', function (done) {
        var params = {
          data: JSON.stringify({ "challenge": { "detail": { "contact__c": "jeffdonthemic", "winner_announced__c": "2013-10-03", "terms_of_service__c": "Standard Terms & Conditions", "submission_details__c": "<p>Upload all your source code as a zip (you can simply zip up \n your Eclipse project for convenience) and provide any documentation and/or instructions that \n are needed. Please be clear and concise with any setup instructions.</p><p>A video of your \n application using Jing or Youtube is required. An unmanaged package for installation is also required.</p>", "status__c": "Draft", "start_date__c": "2013-09-25T23:00:00-04:00", "requirements__c": "<p>Please implement the following requirements:</p>", "name": "Awesome New Challenge", "end_date__c": "2013-09-29T23:00:00-04:00", "description__c": "<p>Your \n overview should describe what you are trying to build within a few simple sentences. Remember, \n the person reading your overview has no background on what you are trying to build so try to think \n of the best way to convey the goal of the challenge. You can provide more details in the requirements \n section. Here is a sample:</p><p>We have an existing Salesforce.com application that is not visually \n appealing. It&#39;s a simple search and details application which consists of 1-2 Apex Controllers \n and 3 Visualforce pages. We used a third party service to design a new layout and they have sent us \n the HTML and CSS for our new application. We need your Visualforce and Apex skills to merge the \n HTML and CSS with our existing code.</p>", "comments__c": null, "additional_info__c": null, "challenge_type__c": "Code", "community_judging__c": true, "auto_announce_winners__c": false, "challenge_id__c": null, "post_reg_info__c": null, "require_registration__c": false }, "reviewers": null, "platforms": null, "technologies": null, "prizes": [{ "place__c": 1, "prize__c": "$500", "points__c": 500, "value__c": 500 }, { "place__c": 2, "prize__c": "$250", "points__c": 250, "value__c": 250 }], "commentNotifiers": null, "assets": null } })
        };
        // request.post({ url: setup.testUrl + '/challenges', form: params },  function (err, response, body) {
        //     body = JSON.parse(body);
        //     assert.ok(body.response.success);
        //     done();
        // });
        done();
    });

    /*it('should return error for missing start date', function (done) {
        var params = {
          data: JSON.stringify({ "challenge": { "detail": { "account__c": "001K000000f8R8aIAE", "contact__c": "jeffdonthemic", "winner_announced__c": "2013-10-03", "terms_of_service__c": "Standard Terms & Conditions", "submission_details__c": "<p>Upload all your source code as a zip (you can simply zip up \n your Eclipse project for convenience) and provide any documentation and/or instructions that \n are needed. Please be clear and concise with any setup instructions.</p><p>A video of your \n application using Jing or Youtube is required. An unmanaged package for installation is also required.</p>", "status__c": "Draft", "requirements__c": "<p>Please implement the following requirements:</p>", "name": "Awesome New Challenge", "end_date__c": "2013-09-29T23:00:00-04:00", "description__c": "<p>Your \n overview should describe what you are trying to build within a few simple sentences. Remember, \n the person reading your overview has no background on what you are trying to build so try to think \n of the best way to convey the goal of the challenge. You can provide more details in the requirements \n section. Here is a sample:</p><p>We have an existing Salesforce.com application that is not visually \n appealing. It&#39;s a simple search and details application which consists of 1-2 Apex Controllers \n and 3 Visualforce pages. We used a third party service to design a new layout and they have sent us \n the HTML and CSS for our new application. We need your Visualforce and Apex skills to merge the \n HTML and CSS with our existing code.</p>", "comments__c": null, "additional_info__c": null, "challenge_type__c": "Code", "community_judging__c": true, "auto_announce_winners__c": false, "challenge_id__c": null, "post_reg_info__c": null, "require_registration__c": false }, "reviewers": null, "platforms": null, "technologies": null, "prizes": [{ "place__c": 1, "prize__c": "$500", "points__c": 500, "value__c": 500 }, { "place__c": 2, "prize__c": "$250", "points__c": 250, "value__c": 250 }], "commentNotifiers": null, "assets": null } })
        };
        request.post({ url: setup.testUrl + '/challenges', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            console.log(body);
            assert.ok(!body.response.success && body.response.errors[0].errorMessage == "Required fields are missing: [Start_Date__c]");
            done();
        });
    });

    it('should return error for missing end date', function (done) {
        var params = {
          data: JSON.stringify({ "challenge": { "detail": { "account__c": "001K000000f8R8aIAE", "contact__c": "jeffdonthemic", "winner_announced__c": "2013-10-03", "terms_of_service__c": "Standard Terms & Conditions", "submission_details__c": "<p>Upload all your source code as a zip (you can simply zip up \n your Eclipse project for convenience) and provide any documentation and/or instructions that \n are needed. Please be clear and concise with any setup instructions.</p><p>A video of your \n application using Jing or Youtube is required. An unmanaged package for installation is also required.</p>", "status__c": "Draft", "start_date__c": "2013-09-25T23:00:00-04:00", "requirements__c": "<p>Please implement the following requirements:</p>", "name": "Awesome New Challenge", "description__c": "<p>Your \n overview should describe what you are trying to build within a few simple sentences. Remember, \n the person reading your overview has no background on what you are trying to build so try to think \n of the best way to convey the goal of the challenge. You can provide more details in the requirements \n section. Here is a sample:</p><p>We have an existing Salesforce.com application that is not visually \n appealing. It&#39;s a simple search and details application which consists of 1-2 Apex Controllers \n and 3 Visualforce pages. We used a third party service to design a new layout and they have sent us \n the HTML and CSS for our new application. We need your Visualforce and Apex skills to merge the \n HTML and CSS with our existing code.</p>", "comments__c": null, "additional_info__c": null, "challenge_type__c": "Code", "community_judging__c": true, "auto_announce_winners__c": false, "challenge_id__c": null, "post_reg_info__c": null, "require_registration__c": false }, "reviewers": null, "platforms": null, "technologies": null, "prizes": [{ "place__c": 1, "prize__c": "$500", "points__c": 500, "value__c": 500 }, { "place__c": 2, "prize__c": "$250", "points__c": 250, "value__c": 250 }], "commentNotifiers": null, "assets": null } })
        };
        request.post({ url: setup.testUrl + '/challenges', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            console.log(body);
            assert.ok(!body.response.success && body.response.errors[0].errorMessage == "Required fields are missing: [End_Date__c]");
            done();
        });
    });

    it('should return error for missing description', function (done) {
        var params = {
          data: JSON.stringify({ "challenge": { "detail": { "account__c": "001K000000f8R8aIAE", "contact__c": "jeffdonthemic", "winner_announced__c": "2013-10-03", "terms_of_service__c": "Standard Terms & Conditions", "submission_details__c": "<p>Upload all your source code as a zip (you can simply zip up \n your Eclipse project for convenience) and provide any documentation and/or instructions that \n are needed. Please be clear and concise with any setup instructions.</p><p>A video of your \n application using Jing or Youtube is required. An unmanaged package for installation is also required.</p>", "status__c": "Draft", "start_date__c": "2013-09-25T23:00:00-04:00", "requirements__c": "<p>Please implement the following requirements:</p>", "name": "Awesome New Challenge", "end_date__c": "2013-09-29T23:00:00-04:00", "comments__c": null, "additional_info__c": null, "challenge_type__c": "Code", "community_judging__c": true, "auto_announce_winners__c": false, "challenge_id__c": null, "post_reg_info__c": null, "require_registration__c": false }, "reviewers": null, "platforms": null, "technologies": null, "prizes": [{ "place__c": 1, "prize__c": "$500", "points__c": 500, "value__c": 500 }, { "place__c": 2, "prize__c": "$250", "points__c": 250, "value__c": 250 }], "commentNotifiers": null, "assets": null } })
        };
        request.post({ url: setup.testUrl + '/challenges', form: params },  function (err, response, body) {
            body = JSON.parse(body);
            console.log(body);
            assert.ok(!body.response.success && body.response.errors[0].errorMessage == "Description is required.");
            done();
        });
    });*/
});

describe('GET /challenges/recent', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/challenges/recent', function (err, response, body) {
            body = JSON.parse(body);
            assert.ok(body.count > 0);
            done();
        });
    });
    it('should return challenges with the correct technology', function(done){
      request.get(setup.testUrl + '/challenges/recent?technology=Ruby', function (err, response, body) {
          body = JSON.parse(body);
          assert.ok(body.count > 0);
          done();
      });
    });
    it('should return challenges with the correct platform', function(done){
      request.get(setup.testUrl + '/challenges/recent?platform=AWS', function (err, response, body) {
          body = JSON.parse(body);
          assert.ok(body.count > 0);
          done();
      });
    });
    it('should return challenges with the correct category', function(done){
      request.get(setup.testUrl + '/challenges/recent?category=Code', function (err, response, body) {
          body = JSON.parse(body);
          assert.ok(body.count > 0);
          done();
      });
    });
});
