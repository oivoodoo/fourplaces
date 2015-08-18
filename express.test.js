var request = require('supertest');
var expect = require('expect.js');

var db = require('./db');
var mongoose = require('mongoose');

var User = require('./models').User;

var app = require('./express');

describe('GET /checkins for creating location and user entries', function(){
  beforeEach(function(done) {
    db.connect('test', function() {
      mongoose.connection.collections['users'].drop(function () {
        done();
      });
    });
  });

  it('should create new user for username on checkin', function(done){
    request(app)
      .get('/checkin')
      .query({
        username: 'kate',
        ltd: '1.1',
        lng: '2.2'
      })
      .end(function(e, response){
        if (e) {
          console.log(e);
          return;
        }

        expect(response.status).to.eql(200);

        User.count(function(err, count) {
          if (err) {
            console.log(err);
            return;
          }

          expect(count).to.eql(1);
          done();
        });
      });
  });

  it('should create location for new user', function(done){
    request(app)
      .get('/checkin')
      .query({
        username: 'kate',
        ltd: '1.1',
        lng: '2.2'
      })
      .end(function(e, response){
        if (e) {
          console.log(e);
          return;
        }

        expect(response.status).to.eql(200);

        User.findOne(function(err, user) {
          if (err) {
            console.log(err);
            return;
          }

          expect(user.locations.length).to.eql(1);
          expect(user.locations[0].ltd).to.eql(1.1);
          expect(user.locations[0].lng).to.eql(2.2);
          done();
        });
      });
  });

  it('should not create multiple users for the same username', function(done){
    request(app)
      .get('/checkin')
      .query({
        username: 'kate',
        ltd: '1.1',
        lng: '2.2'
      })
      .end(function(e, response){
        if (e) {
          console.log(e);
          return;
        }

        request(app)
          .get('/checkin')
          .query({
            username: 'kate',
            ltd: '1.1',
            lng: '2.2'
          })
          .end(function(e, response){

            User.count(function(err, count) {
              if (err) {
                console.log(err);
                return;
              }

              expect(count).to.eql(1);
              done();
            });
          });
      });
  });


  it('should require to have username', function(done){
    request(app)
      .get('/checkin')
      .query({
        ltd: '1.1',
        lng: '2.2'
      })
      .expect(400)
      .end(function(err, res){
        if (err) throw err;
        done();
      });
  });

  it('should require to have lng', function(done){
    request(app)
      .get('/checkin')
      .query({
        username: 'kate',
        ltd: '1.1'
      })
      .expect(400)
      .end(function(err, res){
        if (err) throw err;
        done();
      });
  });

  it('should require to have ltd', function(done){
    request(app)
      .get('/checkin')
      .query({
        username: 'kate',
        lng: '2.2'
      })
      .expect(400)
      .end(function(err, res){
        if (err) throw err;
        done();
      });
  });
});

describe('GET /locations for getting locations by username', function(){
  beforeEach(function(done) {
    db.connect('test', function() {
      mongoose.connection.collections['users'].drop(function () {
        done();
      });
    });
  });

  it('should get the list of the locations', function(done){
    var user = new User({ username: 'kate' });
    user.save(function(err, user) {
      user.createLocation({
        lng: 1.1,
        ltd: 2.2
      }, function(err) {
        request(app)
          .get('/locations')
          .query({ username: 'kate' })
          .end(function(e, response){
            if (e) {
              console.log(e);
              return;
            }

            expect(response.status).to.eql(200);

            var locations = response.body;
            expect(locations.length).to.eql(1);
            expect(locations[0].lng).to.eql(1.1);
            expect(locations[0].ltd).to.eql(2.2);

            done();
          });
      });
    });
  });

  it('should require to have username', function(done){
    request(app)
      .get('/locations')
      .expect(400)
      .end(function(err, res){
        if (err) throw err;

        done();
      });
  });
});
