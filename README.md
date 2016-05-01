# express-json-transform

Express middleware for intercepting and transforming json responses.


## Installation

```bash
npm i -S express-json-transform
```


## Usage

A transform is passed an object from the response and it returns a replacement.


### Basic usage `jsonTransform( transform )`

Middleware can be created by passing a transform function. The transform function will be called with a response object prior to json serialization and it must return a replacement object.

```js
var express = require('express'),
	jsonTransform = require('express-json-transform');

// Create a transform to remove sensitive data from responses
var cleanJson = jsonTransform(function(json) {
	delete json.sensitiveInfo;
	return json;
});

var app = express();

// The middleware can be used anywhere express accepts middleware
app.use(cleanJson);
```

Now when your route handlers call `res.json({ ... })` or `res.send({ ... })` the objects will be transformed before being sent to the client.

### Conditional usage `jsonTransform( condition, transform )`

Middleware can optionally be created with a function that evaluates whether or not to run the transform. The condition function will be called with a request object and a response object and must return a boolean indicating whether or not the transform should run.

```js
var express = require('express'),
	jsonTransform = require('express-json-transform');

// Create a transform to conditionally remove sensitive data from responses
var cleanJson = jsonTransform(function(req, res) {
    return !!req.params.includeUser;
}, function(json) {
	delete json.sensitiveInfo;
	return json;
});

var app = express();

// The middleware can be used anywhere express accepts middleware
app.use(cleanJson);
```

### Middleware location

Express will let you define middleware in several different places. Each of these uses is valid:

```js
var express = require('express'),
    Router = express.Router;

var transform = require('express-json-transform')(function(json) {
    // modify the response...
    return json;
});

var app = express();
app.use(transform) // application-level middleware
app.get('/path', transform, handler); // middleware for specific route
app.get('/path', [otherMiddleware, transform, handler]) // stacked with other middleware

var router = new Router();
router.use(transform) // router-level middleware
router.get('/path', transform, handler); // middleware for specific route
router.get('/path', [otherMiddleware, transform, handler]) // stacked with other middleware
app.use(router);
```
