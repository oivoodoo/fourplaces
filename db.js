var mongoose = require('mongoose');

DB_CONNECTIONS = {
  test: 'mongodb://localhost/fourplaces-test',
  development: 'mongodb://localhost/fourplaces-develoment',
  production: process.env.MONGODB_URL || process.env.MONGOLAB_URI
};

function connect(env, callback) {
  if (!env) {
    env = process.env.NODE_ENV || 'development';
  }

  mongoose.connect(DB_CONNECTIONS[env], { server: { socketOptions: { keepAlive: 1 } } }, callback);
  mongoose.connection.on('error', console.log);
  mongoose.connection.on('disconnected', module.exports.connect);
}

module.exports.connect = connect;
