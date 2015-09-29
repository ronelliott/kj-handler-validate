'use strict';

var prequire = require('parent-require');

module.exports = function($$resolver) {
    !$$resolver.has('$joi') && $$resolver.add('$joi', prequire('joi'));
    $$resolver.add('$validate', require('./handler'));
};
