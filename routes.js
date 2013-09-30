////////////
// ROUTES //
////////////

exports.routes = {

  get: [
    { path: "/:apiVersion/members/:membername/challenges/past", action: "membersPastChallenges" },
    { path: "/:apiVersion/members/:membername/challenges", action: "membersChallenges" },
    { path: "/:apiVersion/members/:membername/payments", action: "membersPayments" },  
    { path: "/:apiVersion/members/:membername/referrals", action: "membersReferrals" },      
    { path: "/:apiVersion/members/search", action: "membersSearch" },
    { path: "/:apiVersion/members/:membername", action: "membersFetch" },    
    
    { path: "/:apiVersion/challenges/search", action: "challengesSearch"},  
    { path: "/:apiVersion/challenges/advsearch", action: "challengesAdvSearch"},  
    { path: "/:apiVersion/challenges/:id/scorecards", action: "challengesScorecards" },
    { path: "/:apiVersion/challenges/:id/scorecard", action: "challengesScorecard" },    
    { path: "/:apiVersion/challenges/:id/comments", action: "challengesComments" },
    { path: "/:apiVersion/challenges/:challenge_id/submission_deliverables", action: "challengesListSubmissions" },
    { path: "/:apiVersion/challenges/:challenge_id/participants", action: "challengesParticipantsList" },
    { path: "/:apiVersion/challenges/:challenge_id", action: "challengesFetch"} ,
    { path: "/:apiVersion/challenges", action: "challengesList" },    

    { path: "/:apiVersion/sponsors/:id", action: "sponsorsFetch" },       
    { path: "/:apiVersion/sponsors", action: "sponsorsList" },

    { path: "/:apiVersion/categories", action: "categoriesList" },
    { path: "/:apiVersion/technologies", action: "technologiesList" },

    { path: "/:apiVersion/leaderboard/referral", action: "leaderboardReferralList" },
    { path: "/:apiVersion/leaderboard", action: "leaderboardList" },

    { path: "/:apiVersion/communities/:id", action: "communitiesFetch" },
    { path: "/:apiVersion/communities", action: "communitiesList" },

    { path: "/:apiVersion/messages/from/:membername", action: "messagesFrom" },
    { path: "/:apiVersion/messages/to/:membername", action: "messagesTo" },
    { path: "/:apiVersion/messages/inbox/:membername", action: "messagesInbox" },
    { path: "/:apiVersion/messages/:id", action: "messagesFetch" },


    { path: "/:apiVersion/participants/:membername/:challenge_id/submission/:submission_id", action: "deliverablesFetch" },
    { path: "/:apiVersion/participants/:membername/:challenge_id/current_submissions", action: "deliverablesCurrentSubmissions" },
    { path: "/:apiVersion/participants/:membername/:challenge_id/deliverables", action: "deliverablesList" },
    { path: "/:apiVersion/participants/:membername/:challenge_id/delete_submission_url_file", action: "deliverablesDeleteSubmission" },
    { path: "/:apiVersion/participants/:membername/:challenge_id", action: "participantsStatus" },
    { path: "/:apiVersion/participants/:participant_id", action: "participantsFetch" },

    { path: "/:apiVersion/accounts/authenticate", action: "accountsAuthenticate" } , // i mad this a get so it's easier to use for now
    { path: "/:apiVersion/accounts/find_by_service", action: "accountsFindByService" },     
    { path: "/:apiVersion/accounts/:membername/preferences", action: "accountsGetPreferences" },
    { path: "/:apiVersion/accounts/:membername", action: "accountsFindByName" },

    { path: "/:apiVersion/judging/scorecard/:participant_id", action: "judgingScorecardFetch" },
    { path: "/:apiVersion/judging/outstanding/:membername", action: "judgingOutstandingFetch" },
    { path: "/:apiVersion/judging", action: "judgingList" },
    
    { path: "/:apiVersion/tos/:id", action: "tosFetch" },
    { path: "/:apiVersion/tos", action: "tosList" },
    { path: "/:apiVersion/platforms", action: "platformsList"},

  ],

  put: [
  	
    { path: "/:apiVersion/accounts/update_password_token/:membername", action: "accountsUpdatePassToken" },
    { path: "/:apiVersion/accounts/change_password_with_token/:membername", action: "accountsChangePassWithToken" },
    { path: "/:apiVersion/accounts/:membername/marketing", action: "accountsUpdateMarketingInfo" },
    { path: "/:apiVersion/accounts/:membername/referred_by", action: "accountsReferredBy" },
    { path: "/:apiVersion/accounts/:membername/preferences", action: "accountsUpdatePreferences" },

    { path: "/:apiVersion/judging/scorecard/:id", action: "judgingUpdate" },

    { path: "/:apiVersion/participants/:membername/:challenge_id/deliverables", action: "deliverablesUpdate" },
    { path: "/:apiVersion/participants/:membername/:challenge_id", action: "participantsUpdate" },
    
    { path: "/:apiVersion/challenges/:challenge_id", action: "challengesUpdate" },
    
    { path: "/:apiVersion/messages/:id", action: "messagesUpdate" },
    { path: "/:apiVersion/members/:membername", action: "membersUpdate" },    
  ],

  post: [

    { path: "/:apiVersion/messages/:id/reply", action: "messagesReply" },
    { path: "/:apiVersion/messages", action: "messagesCreate" },
    
    { path: "/:apiVersion/communities/add_member", action: "communitiesAddMember" },

    { path: "/:apiVersion/participants/:membername/:challenge_id/submission_url_file", action: "deliverablesCreateSubmission" },
    { path: "/:apiVersion/participants/:membername/:challenge_id/deliverables", action: "deliverablesCreate" },
    { path: "/:apiVersion/participants/:membername/:challenge_id", action: "participantsCreate" },

    { path: "/:apiVersion/judging", action: "judgingCreate" },
    { path: "/:apiVersion/challenges/:challenge_id/survey", action: "surveyInsert"},
    { path: "/:apiVersion/comments", action: "commentInsert"},
    { path: "/:apiVersion/accounts/create", action: "accountsCreate" }
    //{ path: "/:apiVersion/accounts/authenticate", action: "accountsAuthenticate" } 

  ]  

};
