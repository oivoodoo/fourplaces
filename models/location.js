var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = Schema({
  lng: Number,
  ltd: Number
});

module.exports = LocationSchema;
