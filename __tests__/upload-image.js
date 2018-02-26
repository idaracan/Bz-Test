var invoke = require('../build/actions/upload-image').invoke;

var actionName = 'upload-image';

var globals = {
    authdata: {

    }
};

var data = {
    inputs: {
        input: {

        }
    }
};

var authenticationType = 'custom';

var LOG = console;

var callback = function(reply) {
    console.log('Action replied.', JSON.stringify(reply, null, 2));
};

invoke(globals, actionName, data, authenticationType, LOG, callback);