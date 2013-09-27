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
        request.get(setup.testUrl + '/challenges/22/submission_deliverables', function (err, response, body) {
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
        var id = 'a0GK0000008OIRAMA4';

        it('should not be empty', function (done) {
            request.get(setup.testUrl + '/challenges/' + id, function (err, response, body) {
                body = JSON.parse(body);
                assert.ok(body.response);
                done();
            });
        });

        it('should return the appropriate keys when user is admin', function (done) {
            request.get(setup.testUrl + '/challenges/' + id + '?admin=true', function (err, response, body) {
                body = JSON.parse(body);

                assert.ok(body.response);

                assert.ok(body.response.challenge_reviewers__r);
                assert.ok(body.response.challenge_comment_notifiers__r);
                assert.ok(body.response.assets__r);

                done();
            });
        });
    });

    describe('participants', function () {
        it('should not error', function (done) {
            //Hardcoded value - once the appropriate routes get in place,
            //this needs to change
            var id = 'a0GK0000008OIRAMA4';

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

  describe("When there are 3 open challenges", function() {
    beforeEach(function(done) {
      // response is captured using nock `nock.recorder.rec();`
      nock('https://cs9.salesforce.com:443')
        .get('/services/apexrest/v.9/challengeslist?limit=100&offset=0&open=true&orderby=end_date__c&fields=Id%2CChallenge_Id__c%2CName%2CDescription__c%2CTotal_Prize_Money__c%2CChallenge_Type__c%2CDays_till_Close__c%2CRegistered_Members__c%2CParticipating_Members__c%2CStart_Date__c%2CEnd_Date__c%2CIs_Open__c%2CCommunity__r.Name%2CCommunity__r.Community_Id__c')
        .reply(200, "[{\"attributes\":{\"type\":\"Challenge__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge__c/a0GK0000006rYt6MAE\"},\"Total_Prize_Money__c\":750,\"End_Date__c\":\"2013-09-26T19:19:00.000+0000\",\"Registered_Members__c\":2,\"Challenge_Platforms__r\":{\"totalSize\":1,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"Challenge_Platform__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Platform__c/a1KK0000001EQzuMAG\"},\"Name__c\":\"Salesforce.com\",\"Id\":\"a1KK0000001EQzuMAG\",\"Challenge__c\":\"a0GK0000006rYt6MAE\"}]},\"Participating_Members__c\":2,\"Challenge_Technologies__r\":{\"totalSize\":1,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"Challenge_Technology__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Technology__c/a1JK0000001X3tLMAS\"},\"Name__c\":\"Apex\",\"Id\":\"a1JK0000001X3tLMAS\",\"Challenge__c\":\"a0GK0000006rYt6MAE\"}]},\"Name\":\"Check on existing CMC Synchronizer\",\"Challenge_Id__c\":\"34\",\"Challenge_Type__c\":\"Code\",\"Id\":\"a0GK0000006rYt6MAE\",\"Description__c\":\"<p>Here is my awesome description that I entered in CMC.</p>\",\"Start_Date__c\":\"2013-08-09T19:19:00.000+0000\",\"Is_Open__c\":\"true\",\"Days_till_Close__c\":3},{\"attributes\":{\"type\":\"Challenge__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge__c/a0GK0000008orZvMAI\"},\"Total_Prize_Money__c\":500,\"End_Date__c\":\"2013-10-31T15:14:00.000+0000\",\"Registered_Members__c\":2,\"Challenge_Platforms__r\":{\"totalSize\":2,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"Challenge_Platform__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Platform__c/a1KK0000001EWCmMAO\"},\"Name__c\":\"Heroku\",\"Id\":\"a1KK0000001EWCmMAO\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Platform__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Platform__c/a1KK0000001EWClMAO\"},\"Name__c\":\"Salesforce.com\",\"Id\":\"a1KK0000001EWClMAO\",\"Challenge__c\":\"a0GK0000008orZvMAI\"}]},\"Participating_Members__c\":2,\"Challenge_Technologies__r\":{\"totalSize\":2,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"Challenge_Technology__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Technology__c/a1JK0000001Y4TTMA0\"},\"Name__c\":\"Apex\",\"Id\":\"a1JK0000001Y4TTMA0\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Technology__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Technology__c/a1JK0000001Y4TUMA0\"},\"Name__c\":\"JavaScript\",\"Id\":\"a1JK0000001Y4TUMA0\",\"Challenge__c\":\"a0GK0000008orZvMAI\"}]},\"Name\":\"First2Finish Challenge 2\",\"Challenge_Id__c\":\"65\",\"Challenge_Type__c\":\"First2Finish\",\"Id\":\"a0GK0000008orZvMAI\",\"Description__c\":\"<p>Your overview should describe what you are trying to build within a few simple sentences. Remember, the person reading your overview has no background on what you are trying to build so try to think of the best way to convey the goal of the challenge. You can provide more details in the requirements section. Here is a sample:</p>\\n\\n<p>We have an existing Salesforce.com application that is not visually appealing. It&#39;s a simple search and details application which consists of 1-2 Apex Controllers and 3 Visualforce pages. We used a third party service to design a new layout and they have sent us the HTML and CSS for our new application. We need your Visualforce and Apex skills to merge the HTML and CSS with our existing code.</p>\",\"Start_Date__c\":\"2013-06-25T07:00:00.000+0000\",\"Is_Open__c\":\"true\",\"Days_till_Close__c\":38},{\"attributes\":{\"type\":\"Challenge__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge__c/a0GK0000008q3yKMAQ\"},\"Total_Prize_Money__c\":500,\"End_Date__c\":\"2013-10-31T15:14:00.000+0000\",\"Registered_Members__c\":2,\"Challenge_Platforms__r\":{\"totalSize\":2,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"Challenge_Platform__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Platform__c/a1KK0000001EYetMAG\"},\"Name__c\":\"Heroku\",\"Id\":\"a1KK0000001EYetMAG\",\"Challenge__c\":\"a0GK0000008q3yKMAQ\"},{\"attributes\":{\"type\":\"Challenge_Platform__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Platform__c/a1KK0000001EYesMAG\"},\"Name__c\":\"Salesforce.com\",\"Id\":\"a1KK0000001EYesMAG\",\"Challenge__c\":\"a0GK0000008q3yKMAQ\"}]},\"Participating_Members__c\":2,\"Challenge_Technologies__r\":{\"totalSize\":2,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"Challenge_Technology__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Technology__c/a1JK0000001Y5uNMAS\"},\"Name__c\":\"Apex\",\"Id\":\"a1JK0000001Y5uNMAS\",\"Challenge__c\":\"a0GK0000008q3yKMAQ\"},{\"attributes\":{\"type\":\"Challenge_Technology__c\",\"url\":\"/services/data/v25.0/sobjects/Challenge_Technology__c/a1JK0000001Y5uOMAS\"},\"Name__c\":\"JavaScript\",\"Id\":\"a1JK0000001Y5uOMAS\",\"Challenge__c\":\"a0GK0000008q3yKMAQ\"}]},\"Name\":\"Node Test Challenge\",\"Challenge_Id__c\":\"66\",\"Challenge_Type__c\":\"Code\",\"Id\":\"a0GK0000008q3yKMAQ\",\"Description__c\":\"<p>\\n\\tYour overview should describe what you are trying to build within a few simple sentences. Remember, the person reading your overview has no background on what you are trying to build so try to think of the best way to convey the goal of the challenge. You can provide more details in the requirements section. Here is a sample:</p>\\n<p>\\n\\tWe have an existing Salesforce.com application that is not visually appealing. It&#39;s a simple search and details application which consists of 1-2 Apex Controllers and 3 Visualforce pages. We used a third party service to design a new layout and they have sent us the HTML and CSS for our new application. We need your Visualforce and Apex skills to merge the HTML and CSS with our existing code.</p>\",\"Start_Date__c\":\"2013-06-25T07:00:00.000+0000\",\"Is_Open__c\":\"true\",\"Days_till_Close__c\":38}]", {
          date: 'Mon, 23 Sep 2013 16:56:15 GMT',
          'content-type': 'application/json;charset=UTF-8',
          'transfer-encoding': 'chunked'
        });

      done();
    });

    it("returns 3 challenges", function(done) {
      request.get(setup.testUrl + '/challenges', function(err, response, body) {
        body = JSON.parse(body);
        assert.equal(body.count, 3);
        assert.lengthOf(body.response, 3);
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
        assert.propertyVal(challenge, "challenge_platforms__r");
        assert.propertyVal(challenge, "challenge_technologies__r");

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
      sfdcReq = sfdcNock({orderby: "end_date__c"});
      request.get(setup.testUrl + '/challenges', function(err, response, body) {
        body = JSON.parse(body);
        sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
        done();
      });
    });

    it("forcifies order_by parameter when sending sfdc request", function(done) {
      sfdcReq = sfdcNock({orderby: "registered_members__c"});
      request.get(setup.testUrl + '/challenges?order_by=registered_members', function(err, response, body) {
        body = JSON.parse(body);
        sfdcReq.done();
        done();
      });
    });

    it("order_by parameter can have 'desc' or 'asc'", function(done) {
      sfdcReq = sfdcNock({orderby: "registered_members__c desc"});
      request.get(setup.testUrl + '/challenges?order_by=registered_members desc', function(err, response, body) {
        body = JSON.parse(body);
        sfdcReq.done();
        done();
      });
    });

  }); // end of order_by parameter test

  describe("open parameter test", function() {
    it("default value is true", function(done) {
      sfdcReq = sfdcNock({open: "true"});
      request.get(setup.testUrl + '/challenges', function(err, response, body) {
        body = JSON.parse(body);
        sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
        done();
      });
    });

    it("able to set open parameter as false", function(done) {
      sfdcReq = sfdcNock({open: "false"});
      request.get(setup.testUrl + '/challenges?open=false', function(err, response, body) {
        body = JSON.parse(body);
        sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
        done();
      });
    });

  }); // end of open parameter test

  it("able to set technology parameter", function(done) {
    sfdcReq = sfdcNock({technology: "ruby"});
    request.get(setup.testUrl + '/challenges?technology=ruby', function(err, response, body) {
      body = JSON.parse(body);
      sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
      done();
    });
  });
  it("able to set platform parameter", function(done) {
    sfdcReq = sfdcNock({platform: "heroku"});
    request.get(setup.testUrl + '/challenges?platform=heroku', function(err, response, body) {
      body = JSON.parse(body);
      sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
      done();
    });
  });
  it("able to set category parameter", function(done) {
    sfdcReq = sfdcNock({category: "code"});
    request.get(setup.testUrl + '/challenges?category=code', function(err, response, body) {
      body = JSON.parse(body);
      sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
      done();
    });
  });

  it("able to set limit and offset parameters", function(done) {
    sfdcReq = sfdcNock({
      limit: 20,
      offset: 30
    });
    request.get(setup.testUrl + '/challenges?limit=20&offset=30', function(err, response, body) {
      body = JSON.parse(body);
      sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
      done();
    });
  });

  it("default value of limit and offset is 100 and 0", function(done) {
    sfdcReq = sfdcNock({
      limit: 100,
      offset: 0
    });
    request.get(setup.testUrl + '/challenges', function(err, response, body) {
      body = JSON.parse(body);
      sfdcReq.done(); // make sure that the sfdc api call occured with orderby option.
      done();
    });
  });
});

describe("GET /challenges/:id/scorecards", function() {
  before(function(done) {
    setup.init(done);
  });

  beforeEach(function(done) {
    nock('https://cs9.salesforce.com:443')
      .get('/services/apexrest/v.9/challenges/65/scorecards?fields=id,name,member__r.name,member__r.profile_pic__c,member__r.country__c,challenge__c,money_awarded__c,prize_awarded__c,place__c,score__c,submitted_date__c')
      .reply(200, "[{\"attributes\":{\"type\":\"Challenge_Participant__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Participant__c/a0AK000000BTelZMAT\"},\"Name\":\"CP-72503\",\"Submitted_Date__c\":\"2013-09-12T15:19:15.000+0000\",\"Money_Awarded__c\":0.00,\"Score__c\":27.5,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007NIQmMAO\"},\"Name\":\"jeffdonthemic\",\"Country__c\":\"United States\",\"Id\":\"a0IK0000007NIQmMAO\",\"Profile_Pic__c\":\"http://res.cloudinary.com/hz2trkcbb/image/upload/c_fill,h_125,w_125/v1377567951/jeffdonthemic.jpg\"},\"Member__c\":\"a0IK0000007NIQmMAO\",\"Id\":\"a0AK000000BTelZMAT\",\"Scorecard__r\":{\"totalSize\":1,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"QwikScore_Scorecard__c\",\"url\":\"/services/data/v22.0/sobjects/QwikScore_Scorecard__c/a0OK0000002OYF3MAO\"},\"Challenge_Participant__c\":\"a0AK000000BTelZMAT\",\"Reviewer__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007NIQoMAO\"},\"Name\":\"mess\",\"Id\":\"a0IK0000007NIQoMAO\"},\"Final_Score__c\":27.500,\"Reviewer__c\":\"a0IK0000007NIQoMAO\",\"Id\":\"a0OK0000002OYF3MAO\",\"Total_Raw_Score__c\":6.00}]},\"Challenge__c\":\"a0GK0000008orZvMAI\"}]", {
        date: 'Mon, 23 Sep 2013 23:45:50 GMT',
        'content-type': 'application/json;charset=UTF-8',
        'transfer-encoding': 'chunked'
      });
    done();
  });

  it('returned count is 1', function(done) {
    request.get(setup.testUrl + '/challenges/65/scorecards', function(err, response, body) {
      body = JSON.parse(body);
      assert.equal(body.count, 1);
      done();
    });
  });

  it("responsed object has proper fields", function(done) {
    request.get(setup.testUrl + '/challenges/65/scorecards', function(err, response, body) {
      body = JSON.parse(body);
      var scorecard = body.response;
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

  beforeEach(function(done) {
    nock('https://cs9.salesforce.com:443')
      .get('/services/apexrest/v.9/scorecard/65/questions')
      .reply(200, "[{\"attributes\":{\"type\":\"QwikScore_Question_Group__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question_Group__c/a0MK0000005Etb1MAC\"},\"Name\":\"Testing\",\"QwikScore_Questions__r\":{\"totalSize\":1,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"QwikScore_Question__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question__c/a0NK000000CdAIuMAN\"},\"QwikScore_Question_Group__c\":\"a0MK0000005Etb1MAC\",\"Maximum_Value__c\":4,\"Question_Type__c\":\"Numeric\",\"Minimum_Value__c\":1,\"Id\":\"a0NK000000CdAIuMAN\"}]},\"Id\":\"a0MK0000005Etb1MAC\",\"Group_Weight__c\":50},{\"attributes\":{\"type\":\"QwikScore_Question_Group__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question_Group__c/a0MK0000005Etb2MAC\"},\"Name\":\"Functional\",\"QwikScore_Questions__r\":{\"totalSize\":5,\"done\":true,\"records\":[{\"attributes\":{\"type\":\"QwikScore_Question__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question__c/a0NK000000CdAIvMAN\"},\"QwikScore_Question_Group__c\":\"a0MK0000005Etb2MAC\",\"Maximum_Value__c\":4,\"Question_Type__c\":\"Numeric\",\"Minimum_Value__c\":1,\"Id\":\"a0NK000000CdAIvMAN\"},{\"attributes\":{\"type\":\"QwikScore_Question__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question__c/a0NK000000CdAIwMAN\"},\"QwikScore_Question_Group__c\":\"a0MK0000005Etb2MAC\",\"Maximum_Value__c\":2,\"Question_Type__c\":\"Numeric\",\"Minimum_Value__c\":1,\"Id\":\"a0NK000000CdAIwMAN\"},{\"attributes\":{\"type\":\"QwikScore_Question__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question__c/a0NK000000CdAIxMAN\"},\"QwikScore_Question_Group__c\":\"a0MK0000005Etb2MAC\",\"Maximum_Value__c\":4,\"Question_Type__c\":\"Numeric\",\"Minimum_Value__c\":1,\"Id\":\"a0NK000000CdAIxMAN\"},{\"attributes\":{\"type\":\"QwikScore_Question__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question__c/a0NK000000CdAIyMAN\"},\"QwikScore_Question_Group__c\":\"a0MK0000005Etb2MAC\",\"Maximum_Value__c\":4,\"Question_Type__c\":\"Numeric\",\"Minimum_Value__c\":1,\"Id\":\"a0NK000000CdAIyMAN\"},{\"attributes\":{\"type\":\"QwikScore_Question__c\",\"url\":\"/services/data/v23.0/sobjects/QwikScore_Question__c/a0NK000000CdAIzMAN\"},\"QwikScore_Question_Group__c\":\"a0MK0000005Etb2MAC\",\"Maximum_Value__c\":4,\"Question_Type__c\":\"Numeric\",\"Minimum_Value__c\":1,\"Id\":\"a0NK000000CdAIzMAN\"}]},\"Id\":\"a0MK0000005Etb2MAC\",\"Group_Weight__c\":50}]", {
        date: 'Mon, 23 Sep 2013 23:53:39 GMT',
        'content-type': 'application/json;charset=UTF-8',
        'transfer-encoding': 'chunked'
      });
    done();
  });

  it('returned count is 2', function(done) {
    request.get(setup.testUrl + '/challenges/65/scorecard', function(err, response, body) {
      body = JSON.parse(body);
      assert.lengthOf(body.response, 2);
      assert.equal(body.count, 2);
      done();
    });
  });

  xit("responsed object has proper fields", function(done) {
    request.get(setup.testUrl + '/challenges/65/scorecard', function(err, response, body) {
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

  beforeEach(function(done) {
    nock('https://cs9.salesforce.com:443')
      .get('/services/apexrest/v.9/comments/65')
      .reply(200, "[{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jUvjIAE\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T15:19:17.000+0000\",\"Id\":\"a09K0000009jUvjIAE\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jWd4IAE\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A submission has been scored but did not pass successfully. The next submission in the queue will now be evaulated.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T15:55:55.000+0000\",\"Id\":\"a09K0000009jWd4IAE\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jYzEIAU\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T18:40:59.000+0000\",\"Id\":\"a09K0000009jYzEIAU\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jYzJIAU\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A submission has been scored but did not pass successfully. The next submission in the queue will now be evaulated.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T18:42:00.000+0000\",\"Id\":\"a09K0000009jYzJIAU\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jZaeIAE\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T20:00:37.000+0000\",\"Id\":\"a09K0000009jZaeIAE\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jZayIAE\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T20:13:43.000+0000\",\"Id\":\"a09K0000009jZayIAE\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jZbNIAU\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A submission has been scored but did not pass successfully. The next submission in the queue will now be evaulated if one exists.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T20:48:19.000+0000\",\"Id\":\"a09K0000009jZbNIAU\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jZbSIAU\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T20:48:44.000+0000\",\"Id\":\"a09K0000009jZbSIAU\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jZbXIAU\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T20:50:50.000+0000\",\"Id\":\"a09K0000009jZbXIAU\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jaOMIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-12T21:17:18.000+0000\",\"Id\":\"a09K0000009jaOMIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdOMIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T14:38:19.000+0000\",\"Id\":\"a09K0000009jdOMIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdORIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T14:38:26.000+0000\",\"Id\":\"a09K0000009jdORIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdOWIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T14:38:34.000+0000\",\"Id\":\"a09K0000009jdOWIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdOgIAI\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A submission has been scored but did not pass successfully. The next submission in the queue will now be evaulated if one exists.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T15:04:11.000+0000\",\"Id\":\"a09K0000009jdOgIAI\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdOhIAI\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T15:04:11.000+0000\",\"Id\":\"a09K0000009jdOhIAI\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdOlIAI\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T15:11:10.000+0000\",\"Id\":\"a09K0000009jdOlIAI\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdQSIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T15:56:50.000+0000\",\"Id\":\"a09K0000009jdQSIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdTJIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T16:31:47.000+0000\",\"Id\":\"a09K0000009jdTJIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdTAIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T16:32:27.000+0000\",\"Id\":\"a09K0000009jdTAIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdTYIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T16:32:52.000+0000\",\"Id\":\"a09K0000009jdTYIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdTdIAI\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T16:37:22.000+0000\",\"Id\":\"a09K0000009jdTdIAI\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdUWIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T16:47:14.000+0000\",\"Id\":\"a09K0000009jdUWIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdUbIAI\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A submission has been scored but did not pass successfully. The next submission in the queue will now be evaulated if one exists.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T16:47:32.000+0000\",\"Id\":\"a09K0000009jdUbIAI\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdUcIAI\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T16:47:32.000+0000\",\"Id\":\"a09K0000009jdUcIAI\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdXNIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T18:17:19.000+0000\",\"Id\":\"a09K0000009jdXNIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdXSIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A submission has been scored but did not pass successfully. The next submission in the queue will now be evaulated if one exists.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T18:20:37.000+0000\",\"Id\":\"a09K0000009jdXSIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"},{\"attributes\":{\"type\":\"Challenge_Comment__c\",\"url\":\"/services/data/v22.0/sobjects/Challenge_Comment__c/a09K0000009jdXTIAY\"},\"From_Challenge_Admin__c\":false,\"Member__r\":{\"attributes\":{\"type\":\"Member__c\",\"url\":\"/services/data/v22.0/sobjects/Member__c/a0IK0000007RjcqMAC\"},\"Name\":\"clyde\",\"Id\":\"a0IK0000007RjcqMAC\",\"Profile_Pic__c\":\"http://cs-public.s3.amazonaws.com/default_cs_member_image.png\"},\"Comment__c\":\"A new submission has been uploaded for this challenge.\",\"Member__c\":\"a0IK0000007RjcqMAC\",\"CreatedDate\":\"2013-09-16T18:20:38.000+0000\",\"Id\":\"a09K0000009jdXTIAY\",\"Challenge__c\":\"a0GK0000008orZvMAI\"}]", {
        date: 'Mon, 23 Sep 2013 19:12:19 GMT',
        'content-type': 'application/json;charset=UTF-8',
        'transfer-encoding': 'chunked'
      });
    done();
  });

  it('returned count is 27', function(done) {
    request.get(setup.testUrl + '/challenges/65/comments', function(err, response, body) {
      body = JSON.parse(body);
      assert.lengthOf(body.response, 27);
      assert.equal(body.count, 27);
      done();
    });
  });


  it("responsed object has proper fields", function(done) {
    request.get(setup.testUrl + '/challenges/65/comments', function(err, response, body) {
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
        challenge_id: '66',
        comments: 'nothing special, just testing'
    };        

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

describe('GET /challenges/search', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/challenges/search?keyword=test', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.count, 11);
            done();
        });
    });
    it('should be empty', function (done) {
        request.get(setup.testUrl + '/challenges/search?keyword=gnihtemos', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.error, "not_found");
            done();
        });
    });
});



describe('GET /challenges/advsearch', function () {
    before(function (done) {
        setup.init(done);
    });

    it('should not be empty', function (done) {
        request.get(setup.testUrl + '/challenges/advsearch?p_min=1&c=all&sort_by=end_date__c&q=node&p=all&state=open&sort_order=ASC&t=all&m_max=1000&m_min=100&p_max=5', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.count, 1);
            done();
        });
    });
    it('should be empty', function (done) {
        request.get(setup.testUrl + '/challenges/advsearch?c=all&sort_by=end_date__c&p_min=1&p=aws,cloud foundry&state=open&sort_order=DESC&t=all&m_max=1000&m_min=100&p_max=5', function (err, response, body) {
            body = JSON.parse(body);
            assert.equal(body.error, "not_found");
            done();
        });
    });
});