var express = require('express'),
	request = require('supertest'),
	jsonTransform = require('../');

function condition(req) {
	return req.get('Accept') === 'application\/munged+json';
}

function transform(json) {
	json.transformed = true;
	return json;
}

describe('express-json-transform', function() {
	describe('on res.json', function() {
		basicTests(function handler(req, res) {
			res.json({
				foo: 'bar'
			});
		});
	});

	describe('on res.send', function() {
		basicTests(function handler(req, res) {
			res.send({
				foo: 'bar'
			});
		});
	});

	function basicTests(handler) {
		describe('as app-level middleware', function() {
			describe('with condition', function() {
				var app;

				before(function() {
					app = express().use(jsonTransform(condition, transform)).get('/', handler);
				});

				it('should transform the response when condition is met', function(done) {
					request(app)
						.get('/')
						.set('Accept', 'application/munged+json')
						.expect(200)
						.expect('Content-Type', /application\/json/)
						.expect({
							foo: 'bar',
							transformed: true
						})
						.end(done);
				});

				it('should not transform the response when condition is not met', function(done) {
					request(app)
						.get('/')
						.expect(200)
						.expect('Content-Type', /application\/json/)
						.expect({
							foo: 'bar'
						})
						.end(done);
				});
			});

			describe('without condition', function() {
				var app;

				before(function() {
					app = express().use(jsonTransform(transform)).get('/', handler);
				});

				it('should transform the response', function(done) {
					request(app)
						.get('/')
						.expect(200)
						.expect('Content-Type', /application\/json/)
						.expect({
							foo: 'bar',
							transformed: true
						})
						.end(done);
				});
			});
		});

		describe('as route-level middleware', function() {
			describe('with condition', function() {
				var app;

				before(function() {
					app = express().get('/', jsonTransform(condition, transform), handler);
				});

				it('should transform the response when condition is met', function(done) {
					request(app)
						.get('/')
						.set('Accept', 'application/munged+json')
						.expect(200)
						.expect('Content-Type', /application\/json/)
						.expect({
							foo: 'bar',
							transformed: true
						})
						.end(done);
				});

				it('should not transform the response when condition is not met', function(done) {
					request(app)
						.get('/')
						.expect(200)
						.expect('Content-Type', /application\/json/)
						.expect({
							foo: 'bar'
						})
						.end(done);
				});
			});

			describe('without condition', function() {
				var app;

				before(function() {
					app = express().get('/', jsonTransform(transform), handler);
				});

				it('should transform the response', function(done) {
					request(app)
						.get('/')
						.expect(200)
						.expect('Content-Type', /application\/json/)
						.expect({
							foo: 'bar',
							transformed: true
						})
						.end(done);
				});
			});
		});
	}
});
