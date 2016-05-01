/**
 * Express middleware for intercepting and transforming json responses
 *
 * @param {function} [condition] - takes the req and res and returns a boolean indicating whether to run the transform on this response
 * @param {function} transform - takes an object passed to res.json and returns a replacement object
 * @return {function} the middleware
 * @public
 */
module.exports = function(condition, transform) {
	// condition parameter is optional
	if( !transform ) {
		transform = condition;
		condition = function() { return true; };
	}

	function replaceJson(res) {
		var origJson = res.json;
		res.json = function(val) {
			return origJson.call(res, transform(val));
		};
	}

	return function(req, res, next) {
		if(condition(req, res)) replaceJson(res);

		next();
	};
};
