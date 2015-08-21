'use strict';

module.exports = function(resolver) {
    resolver.add('joi', require('joi'));
    resolver.add('validate', require('./view'));
};
