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

    { path: "/:apiVersion/challenges/:challenge_id", action: "challengesFetch"}

  ],

  put: [
  
  ],

  post: [
    { path: "/:apiVersion/messages", action: "messagesCreate" },

    //{ path: "/:apiVersion/accounts/authenticate", action: "accountsAuthenticate" } 

  ]  

};
