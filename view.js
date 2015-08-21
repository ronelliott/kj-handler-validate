'use strict';

var _ = require('underscore'),
    is = require('is'),
    objectPath = require('object-path');

function details(err) {
    return err.details
        .reduce(function(errors, error) {
            errors[error.path] = errors[error.path] || [];
            errors[error.path].push(error.message);
            return errors;
        }, {})
}

module.exports = function(joi, params) {
    var schema = params.schema || {},
        shouldInject = (is.boolean(params.inject) ? params.inject : true) && !is.null(params.inject),
        injectName = is.string(params.inject) ? params.inject : 'body',
        sourcePath = params.source || 'req.body',
        sourceObjName = sourcePath.split('.')[0];

    schema = schema.isJoi ? schema : joi.object().keys(schema);

    return function(resolver, res, next) {
        var sourceObj = {};
        sourceObj[sourceObjName] = resolver(sourceObjName);
        var source = objectPath.get(sourceObj, sourcePath);

        schema.validate(source,
            function(err, params) {
                if (err) {
                    res.status('bad request');
                    next({
                        error: err.name,
                        details: details(err)
                    });
                    return;
                }

                if (shouldInject) {
                    resolver.add(injectName, params);
                }

                next();
            });
    };
};
