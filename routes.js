////////////
// ROUTES //
////////////

exports.routes = {

  get: [
    { path: "/:apiVersion/members/:memberName", action: "membersFetch" },   
    { path: "/:apiVersion/members", action: "membersList" },  

    { path: "/:apiVersion/sponsors/:sfid", action: "sponsorsFetch" },       
    { path: "/:apiVersion/sponsors", action: "sponsorsList" },      

    { path: "/:apiVersion/accounts/find_by_service", action: "accountsFindByService" },    
    { path: "/:apiVersion/accounts/authenticate", action: "accountsAuthenticate" },      

  ]

};
