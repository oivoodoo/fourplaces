var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LocationSchema = require('./location');

var UserSchema = Schema({
  username: String,
  locations: [LocationSchema]
});

UserSchema.methods.createLocation = function (attributes, callback) {
  this.locations.push(attributes);
  this.save(callback);
  return this;
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
