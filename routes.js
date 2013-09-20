////////////
// ROUTES //
////////////

exports.routes = {

  get: [
    { path: "/:apiVersion/members/:membername", action: "membersFetch" },   
    { path: "/:apiVersion/members", action: "membersList" },  

    { path: "/:apiVersion/sponsors/:id", action: "sponsorsFetch" },       
    { path: "/:apiVersion/sponsors", action: "sponsorsList" },      

    { path: "/:apiVersion/accounts/find_by_service", action: "accountsFindByService" },     
    { path: "/:apiVersion/accounts/:membername", action: "accountsFindByName" }    

  ],

  put: [
  
  ],

  post: [

    { path: "/:apiVersion/accounts/authenticate", action: "accountsAuthenticate" } 

  ]  

};
