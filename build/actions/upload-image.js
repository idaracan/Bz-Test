var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
 
/**
 * @author Ivan Ramirez
 */ 

var nfetch = REQUIRED('node-fetch');

var encodeParams = function(opts) {
    var formBody = [];

    for (var property in opts) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(opts[property]);
        formBody.push(encodedKey + '=' + encodedValue);
    }

    return formBody.join('&');
}

invoke = function(globals, actionName, data, authenticationType, LOG, callback) {
    /** 
     * get data from global inputs
     * encode data in URL
     * exceutues request
    */
    var auth = {
        client_id: globals.authdata.client_id,
        client_secret: globals.authdata.client_secret,
        scope: globals.authdata.scope,
        redirect_url: globals.authdata.redirect_url,
        access_token: globals.authdata.access_token,
        refresh_token: globals.authdata.refresh_token,
        grant_type: 'refresh_token'
    };
    var url = encodeParams(auth);
    var user = data.inputs.input.user;
    nfetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', 
    { 
        method: 'POST', 
        body: url, 
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Accept': 'application/json'
        }
    }).then(function(res) /** encode response to JSON */
    {
        return res.json();
    }).then(function(json) 
    {   /** authentication */
        if(json.error)
        {
            LOG.info('+++ Error Auth +++');
            var outp1 = {error: json.error, message: json.error_description, status: 400};
            LOG.info(outp1);
            var error = RESPONSE(outp1, null , 400);
            callback(error);
        }
        else /** authenticated */
        {
            var bearertoken = json.access_token;
            nfetch('https://graph.microsoft.com/v1.0/sites/root', 
                { 
                    method: 'GET', 
                    headers: {'Authorization': 'Bearer '+bearertoken}
                }
            ).then(function(res) 
            {
                return res.json();
            }).then(function(json) 
            {
                if(json.error)
                {
                    LOG.info('+++ Error +++');
                    var outp1 = {error: json.error.code, message: json.error.message, status: 400};
                    LOG.info(outp1);
                    var error = RESPONSE(outp1, null , 400);
                    callback(error);
                }
                else
                {
                    LOG.info('+++ Success +++');
                    var res = json;
                    res = 
                    {
                        id: res.id,
                        name: res.name,
                        displayName: res.displayName,
                        description: res.description,
                        createdDateTime: res.createdDateTime,
                        lastModifiedDateTime: res.lastModifiedDateTime,
                        webUrl: res.webUrl
                    }
                    var success = RESPONSE(res, null, 200);
                    callback(success);
                }
            });
        }
    });   
}

exports.invoke = invoke;
