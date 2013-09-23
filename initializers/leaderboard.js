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
        },

        referral: {
            list: function (next) {
                var query = "select count(id)total, referred_by_member__r.name, " +
                            "referred_by_member__r.profile_pic__c, referred_by_member__r.country__c from Referral__c " +
                            "where converted__c = true and referred_by_member__r.account__r.name = 'appirio' " +
                            "group by referred_by_member__r.name, referred_by_member__r.profile_pic__c, referred_by_member__r.country__c";

                api.sfdc.org.query(query, api.sfdc.oauth, function (err, resp) {
                    if (!err && resp && resp.records) {
                        next(resp.records);
                    }
                });
            }
        }
    };
    next();
}