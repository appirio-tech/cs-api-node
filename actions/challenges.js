exports.surveyInsert = {
  name: "surveyInsert",
  description: "Creates a new survey for a challenge. Method: POST",
  inputs: {
    required: ['challenge_id'],
    optional: ['requirements','timeframe','prize_money','compete_again','improvements','why_no_submission'],
  },
  blockedConnectionTypes: [],
  outputExample: { success: true, message: 'Survey entry added successfully' },
  authenticated: true,
  version: 2.0,
  run: function(api, connection, next){
    api.challenges.surveyInsert(connection.params, function(error, data){
      if (error) {
        if (error.statusCode)
          connection.rawConnection.responseHttpCode = error.statusCode;
        connection.error = error;
      } else {
        connection.rawConnection.responseHttpCode = 201;
      }
      connection.response.response = data;
      next(connection, true);
    });
  }
};

exports.commentInsert = {
  name: "commentInsert",
  description: "Inserts a new comment to a challenge. Method: POST",
  inputs: {
    required: ['challenge_id', 'membername', 'comments'],
    optional: ['reply_to'],
  },
  blockedConnectionTypes: [],
  outputExample: { success: true, message: '' },
  authenticated: true,
  version: 2.0,
  run: function(api, connection, next){
    api.challenges.commentInsert(connection.params, function(error, data){
      if (error) {
        if (error.statusCode)
          connection.rawConnection.responseHttpCode = error.statusCode;
        connection.error = error;
      } else {
        connection.rawConnection.responseHttpCode = 201;
      }
      connection.response.response = data;
      next(connection, true);
    });
  }
};
