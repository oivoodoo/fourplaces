var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    logger = require('morgan');


var db = require('./db');
db.connect();

var User = require('./models').User;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

app.use('/checkin', function requireParams(request, response, next) {
  if (!request.query.username || !request.query.lng || !request.query.ltd) {
    response.status(400).end();
  } else {
    next();
  }
});

app.use(function findUser(request, response, next) {
  var params = request.query;

  User.findOne({ username: params.username }, function(err, user) {
    if (err) {
      console.log(err);
    }

    if (user) {
      request.user = user;
      next();
    } else {
      user = new User({ username: params.username });
      user.save(function(err, user) {
        if (err) {
          console.log(err);
        }

        request.user = user;
        next();
      });
    }
  });
});

app.get('/checkin', function(request, response, next) {
  var params = request.query;
  var user = request.user;

  user.createLocation({
    lng: params.lng,
    ltd: params.ltd,
    name: params.name
  }, function(err) {
    if (err) {
      console.log(err);
    }

    response.send(200);
  });
});

app.use('/locations', function requireParams(request, response, next) {
  if (!request.query.username) {
    response.status(400).end();
  } else {
    next();
  }
});

app.get('/locations', function(request, response, next) {
  response.json(request.user.locations);
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on port 3000');
});

module.exports = app;
