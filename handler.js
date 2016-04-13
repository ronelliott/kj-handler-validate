'use strict';

const _ = require('underscore'),
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

module.exports = function($joi, $opts) {
    var schema = $opts.schema || {},
        shouldInject = (is.boolean($opts.inject) ? $opts.inject : true) && !is.null($opts.inject),
        injectName = is.string($opts.inject) ? $opts.inject : 'body',
        sourcePath = $opts.source || 'req.body',
        sourceObjName = sourcePath.split('.')[0];

    schema = schema.isJoi ? schema : $joi.object().keys(schema);

    return function(err, $resolver, $res, $next) {
        if (err) {
            $next();
            return;
        }

        var sourceObj = {};
        sourceObj[sourceObjName] = $resolver(sourceObjName);
        var source = objectPath.get(sourceObj, sourcePath);

        schema.validate(source,
            function(err, params) {
                if (err) {
                    $res.status('bad request');
                    $next({
                        error: err.name,
                        details: details(err)
                    });
                    return;
                }

                if (shouldInject) {
                    $resolver.add(injectName, params);
                }

                $next();
            });
    };
};
