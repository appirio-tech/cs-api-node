var forcifier = require("forcifier")
  , utils = require("../utils");

exports.action = {
  name: "judgingList",
  description: "Fetches challenges that need judges. Method: GET",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: true,
  outputExample: [
    {
      attributes:
      {
        type: "Challenge__c",
        url: "/services/data/v26.0/sobjects/Challenge__c/a0GK0000006k2g6MAA"
      },
      id: "a0GK0000006k2g6MAA",
      challenge_id: "19",
      name: "Testing - First2Finish",
      status: "Review",
      number_of_reviewers: 1,
      end_date: "2013-07-15T18:49:41.000+0000",
      review_date: "2013-07-17",
      challenge_categories__r: null,
      challenge_platforms__r: [
        {
          attributes:
          {
            type: "Challenge_Platform__c",
            url: "/services/data/v26.0/sobjects/Challenge_Platform__c/a1KK0000001EM4tMAG"
          },
          name: "Heroku"
        },
        {
          attributes:
          {
            type: "Challenge_Platform__c",
            url: "/services/data/v26.0/sobjects/Challenge_Platform__c/a1KK0000001EM4sMAG"
          },
          name: "Salesforce.com"
        }
      ],
      challenge_technologies__r: [
        {
          attributes:
          {
            type: "Challenge_Technology__c",
            url: "/services/data/v26.0/sobjects/Challenge_Technology__c/a1JK0000001WBF8MAO"
          },
          name: "JavaScript"
        },
        {
          attributes:
          {
            type: "Challenge_Technology__c",
            url: "/services/data/v26.0/sobjects/Challenge_Technology__c/a1JK0000001WBF7MAO"
          },
          name: "Apex"
        }
      ]
    }
  ],
  version: 2.0,
  run: function(api, connection, next){
    var query = "select id, challenge_id__c, name, status__c, number_of_reviewers__c, " +
      "end_date__c, review_date__c, " +
      "(select display_name__c from challenge_categories__r), " +
      "(select name__c from challenge_platforms__r), " +
      "(select name__c from challenge_technologies__r) " +
      "from Challenge__c where community_judging__c = true and status__c IN ('Open for Submissions','Review') " +
      "and number_of_reviewers__c < 3 order by end_date__c";
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.query(query, session.oauth, function (err, resp) {
        if (!err && resp.records) {
          utils.processResponse(resp.records, connection, {"throw404": false, "smartParsing": false});
          next(connection, true);
        }
      });
    });
  }
};
exports.judgingScorecardFetch = {
  name: "judgingScorecardFetch",
  description: "Fetches a specific scorecard. Method: GET",
  inputs: {
    required: ['participant_id', 'judge_membername'],
    optional: [],
  },
  authenticated: true,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    var url = 'v.9/scorecard/' + connection.params.participant_id;
    var params = [{key: 'reviewer', value: connection.params.judge_membername}];
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({uri: url, method: 'GET', urlParams: params}, session.oauth, function (err, resp) {
        if (resp) {
          var data = resp[_.first(_.keys(resp))];
          utils.processResponse(data, connection);
          next(connection, true);
        }
      });
    });
  }
};

exports.judgingOutstandingFetch = {
  name: "judgingOutstandingFetch",
  description: "Fetches challenges that member needs to judge. Method: GET",
  inputs: {
    required: ["membername"],
    optional: [],
  },
  authenticated: true,
  outputExample: {},
  version: 2.0,
  run: function(api, connection, next){
    var removeAttributes = function(data) {
      var fixed = _.isArray(data) ? [] : {};
      for (key in data) {
        if (key === 'attributes') continue;

        if (_.isObject(data[key])) {
          if (_.isArray(data)) {
            fixed.push(removeAttributes(data[key]));
          } else {
            fixed[key] = removeAttributes(data[key]);
          }
        } else {
          fixed[key] = data[key];
        }
      }
      return fixed;
    };

    var url = "v1/members/" + connection.params.membername + "/outstandingscorecards";
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({uri: url, method: "GET"}, session.oauth, function (err, resp) {
        if (!err && resp) {
          var data = removeAttributes(resp);
          connection.response.response = data;
          connection.response.count = data.length;
          next(connection, true);
        }
      });
    });
  }
};

exports.judgingCreate = {
  name: "judgingCreate",
  description: "Adds a member as a judge to a challenge. Method: POST",
  inputs: {
    required: ["membername", "challenge_id"],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "Thank you! You are now a judge for this challenge."
  },
  version: 2.0,
  run: function(api, connection, next){
    var body = {
      challenge_id: connection.params.challenge_id,
      memberName: connection.params.membername
    };
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({ uri: 'v.9/judging', method: 'POST', body: body }, session.oauth, function(err, res) {
        if (err) { console.error(err); }
        res.Success = res.Success == "true";
        var data = res;
        connection.response.response = forcifier.deforceJson(data);
        if (connection.response.response.success)
          connection.rawConnection.responseHttpCode = 201;
        next(connection, true);
      });
    });
  }
};

exports.judgingUpdate = {
  name: "judgingUpdate",
  description: "Saves the scorecard for a participant by a judge member. Method: PUT",
  inputs: {
    required: ["id", "answers", "comments", "options"],
    optional: [],
  },
  authenticated: true,
  outputExample: {
    "success": true,
    "message": "Scorecard has been saved successfully."
  },
  version: 2.0,
  run: function(api, connection, next){
    var params = [
      {
        key: 'participant_id',
        value: connection.params.id
      },
      {
        key: 'answers',
        value: connection.params.answers
      },
      {
        key: 'comments',
        value: connection.params.comments
      },
      {
        key: 'options',
        value: connection.params.options
      }
    ];
    api.session.load(connection, function(session, expireTimestamp, createdAt, readAt){
      api.sfdc.org.apexRest({ uri: 'v.9/scorecard', method: 'PUT', urlParams: params }, session.oauth, function(err, res) {
        if (err) { console.error(err); }
        res.Success = Boolean(res.Success);
        connection.response.response = forcifier.deforceJson(res);
        next(connection, true);
      });
    });
  }
};
