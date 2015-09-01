'use strict';

module.exports = function($$resolver) {
    !$$resolver.has('$joi') && $$resolver.add('$joi', require('joi'));
    $$resolver.add('$validate', require('./handler'));
};
