var pg = require('pg').native

exports.members = function(api, next){

  api.members = {

    // methods

    /*
    * Returns all members from from pg
    *
    * Returns a collection of member records
    */
    list: function(next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select id, sfid, name, email__c from member__c limit 5";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    /*
    * Returns a specific member from pg by membername
    *
    * membername - the name of the member to fetch
    * fields - the list of fields to return.  If no fields are specified then the default
    * are passed in form the action.
    *
    * Returns JSON containing the keys specified from the fields
    */
    fetch: function(membername, fields, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }
        var sql = "select " + fields+ " from member__c where name = '" +membername+ "'";
        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    /*
    * Returns payments of a specific member from pg by membername
    *
    * membername - the name of the member to fetch
    * fields - the list of fields to return.  If no fields are specified then the default
    * are passed in form the action.
    * orderBy - the order_by option.
    *
    * Returns JSON containing the keys specified from the fields
    */
    payments: function(membername, fields, orderBy, next) {
      var client = new pg.Client(api.configData.pg.connString);
      client.connect(function(err) {
        if (err) { console.log(err); }

        var sql = "select "+ fields +" from payment__c p"
                + " inner join member__c m on p.member__c = m.sfid"
                + " inner join challenge__c c on p.challenge__c = c.sfid"
                + " where m.name = '" + membername + "' order by " + orderBy;

        client.query(sql, function(err, rs) {
          next(rs['rows']);
        })
      })
    },

    /*
    * Returns a specific member's challenges from apex by membername
    *
    * membername - the name of the member to fetch
    */
    challenges: function(membername, next) {
      api.sfdc.org.apexRest({ uri: 'v1/members/' + membername + '/challenges' }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        next(res);
      });
    },

    /* 
    * Returns referrals of a specific member from sfdb by membername
    *
    * membername - the name of the member to fetch
    *
    * Returns JSON containing the keys specified from the fields
    */
    referrals: function(membername, next) {
      var url = "v.9/referrals/" + escape(membername);

      api.sfdc.org.apexRest({uri: url, method: "GET"}, api.sfdc.oauth, function (err, resp) {
        if(err) { return next(err); }

        next(resp);
      });
    },


    /*
    * Returns a specific member's past challenges from apex by membername
    *
    * membername - the name of the member to fetch
    */
    pastChallenges: function(membername, next) {
      api.sfdc.org.apexRest({ uri: 'v1/members/' + membername + '/challenges/past' }, api.sfdc.oauth, function(err, res) {
        if (err) { console.error(err); }
        next(res);
      });
    },

    /*
     *Searches for a member from pg by keywords search
     *
     * keyword - the keyword used in the search
     * fields - the list of fields to return.  If no fields are specified then the default
     * are passed in form the action.
     *
     * Returns JSON containing the keys specified from the fields
     */
    search: function(keyword, fields, next) {
        var client = new pg.Client(api.configData.pg.connString);
        client.connect(function(err) {
            if (err) { console.log(err); }
            var sql = "select " + fields+ " from member__c where name LIKE '" +keyword+ "%'";
            // console.log('$$$$ sql ', sql);
            client.query(sql, function(err, rs) {
                next(rs['rows']);
            })
        })
    }

  }
  next();
}