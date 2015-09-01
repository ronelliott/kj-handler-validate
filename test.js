'use strict';

var should = require('should'),
    sinon = require('sinon'),
    joi = require('joi'),
    reflekt = require('reflekt'),
    handler = require('./handler');

describe('validate', function() {
    it('should use `req.body` if no source object path is given', function(done) {
        var res = { status: sinon.spy() },
            resolver = new reflekt.ObjectResolver({ req: { body: { foo: 'foo', bar: 'bar' } } }),
            params = {
                schema: {
                    foo: joi.string(),
                    bar: joi.string()
                }
            };

        handler(joi, params)(null, resolver, res, function(err) {
            should(err).not.be.ok();
            should(resolver('body')).eql({ foo: 'foo', bar: 'bar' });
            done();
        });
    });

    it('should use the given source object path', function(done) {
        var res = { status: sinon.spy() },
            resolver = new reflekt.ObjectResolver({ ducks: { body: { foo: 'foo', bar: 'bar' } } }),
            params = {
                source: 'ducks.body',
                schema: {
                    foo: joi.string(),
                    bar: joi.string()
                }
            };

        handler(joi, params)(null, resolver, res, function(err) {
            should(err).not.be.ok();
            should(resolver('body')).eql({ foo: 'foo', bar: 'bar' });
            done();
        });
    });

    it('should inject the results into the resolver using `body` if no name is given', function(done) {
        var res = { status: sinon.spy() },
            resolver = new reflekt.ObjectResolver({ req: { body: { foo: 'foo', bar: 'bar' } } }),
            params = {
                schema: {
                    foo: joi.string(),
                    bar: joi.string()
                }
            };

        handler(joi, params)(null, resolver, res, function(err) {
            should(err).not.be.ok();
            should(resolver('body')).eql({ foo: 'foo', bar: 'bar' });
            done();
        });
    });

    it('should inject the results into the resolver using given name', function(done) {
        var res = { status: sinon.spy() },
            resolver = new reflekt.ObjectResolver({ req: { body: { foo: 'foo', bar: 'bar' } } }),
            params = {
                inject: 'flubber',
                schema: {
                    foo: joi.string(),
                    bar: joi.string()
                }
            };

        handler(joi, params)(null, resolver, res, function(err) {
            should(err).not.be.ok();
            should(resolver('flubber')).eql({ foo: 'foo', bar: 'bar' });
            done();
        });
    });

    it('should not inject the results if a name is null', function(done) {
        var res = { status: sinon.spy() },
            resolver = new reflekt.ObjectResolver({ req: { body: { foo: 'foo', bar: 'bar' } } }),
            params = {
                inject: null,
                schema: {
                    foo: joi.string(),
                    bar: joi.string()
                }
            };

        handler(joi, params)(null, resolver, res, function(err) {
            should(err).not.be.ok();
            should(resolver('body')).equal(undefined);
            done();
        });
    });

    it('should set the status to `bad request`` if validation fails', function(done) {
        var res = { status: sinon.spy() },
            resolver = new reflekt.ObjectResolver({ req: { body: { foo: 'foo', bar: 'bar', dar: 'dar' } } }),
            params = {
                schema: {
                    foo: joi.string(),
                    bar: joi.string()
                }
            };

        handler(joi, params)(null, resolver, res, function(err) {
            should(err).be.ok();
            res.status.calledWith('bad request').should.equal(true);
            done();
        });
    });

    it('should use the given schema directly if it is a joi object', function(done) {
        var res = { status: sinon.spy() },
            resolver = new reflekt.ObjectResolver({ req: { body: { foo: 'foo' } } }),
            params = {
                schema: joi.object().keys({
                    foo: joi.string(),
                    bar: joi.string()
                }).without('foo', 'bar')
            };

        handler(joi, params)(null, resolver, res, function(err) {
            should(err).not.be.ok();
            should(resolver('body')).eql({ foo: 'foo' });
            done();
        });
    });
});
