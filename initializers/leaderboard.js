exports.leaderboard = function (api, next) {
    api.leaderboard = {
        list: function (limit, next) {
            var url = "v.9/leaderboard_all";
            var params = [];
            if (limit) params.push({key: 'limit', value: limit});
            api.sfdc.org.apexRest({uri: url, method: "GET", urlParams: params}, api.sfdc.oauth, function (err, resp) {
                if (!err && resp) {
                    next(resp);
                }
            });
        }
    };
    next();
}