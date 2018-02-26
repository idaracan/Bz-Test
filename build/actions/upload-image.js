var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
 
/**
 * @author Ivan Ramirez
 */ 

function invoke(globals, actionName, data, authenticationType, LOG, callback) {
    
    //Success response
    callback(RESPONSE({
        message: 'Holi'
    }, null, 200));
    

/*     
    Fail response
    var errorMessage = ERROR('GLB.RESPONSE_ERROR', [500, {
        message: 'The server exploded'
    }, new Error('AAaa')]);

    callback(RESPONSE(null, {
        message: 'The server exploded'
    }, -500,  errorMessage)); */
}

exports.invoke = invoke;