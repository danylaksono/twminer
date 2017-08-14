'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newTwgenerator;

describe('Twgenerator API:', function() {
  describe('GET /api/twgenerators', function() {
    var twgenerators;

    beforeEach(function(done) {
      request(app)
        .get('/api/twgenerators')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          twgenerators = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(twgenerators).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/twgenerators', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/twgenerators')
        .send({
          name: 'New Twgenerator',
          info: 'This is the brand new twgenerator!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTwgenerator = res.body;
          done();
        });
    });

    it('should respond with the newly created twgenerator', function() {
      expect(newTwgenerator.name).to.equal('New Twgenerator');
      expect(newTwgenerator.info).to.equal('This is the brand new twgenerator!!!');
    });
  });

  describe('GET /api/twgenerators/:id', function() {
    var twgenerator;

    beforeEach(function(done) {
      request(app)
        .get(`/api/twgenerators/${newTwgenerator._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          twgenerator = res.body;
          done();
        });
    });

    afterEach(function() {
      twgenerator = {};
    });

    it('should respond with the requested twgenerator', function() {
      expect(twgenerator.name).to.equal('New Twgenerator');
      expect(twgenerator.info).to.equal('This is the brand new twgenerator!!!');
    });
  });

  describe('PUT /api/twgenerators/:id', function() {
    var updatedTwgenerator;

    beforeEach(function(done) {
      request(app)
        .put(`/api/twgenerators/${newTwgenerator._id}`)
        .send({
          name: 'Updated Twgenerator',
          info: 'This is the updated twgenerator!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTwgenerator = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTwgenerator = {};
    });

    it('should respond with the updated twgenerator', function() {
      expect(updatedTwgenerator.name).to.equal('Updated Twgenerator');
      expect(updatedTwgenerator.info).to.equal('This is the updated twgenerator!!!');
    });

    it('should respond with the updated twgenerator on a subsequent GET', function(done) {
      request(app)
        .get(`/api/twgenerators/${newTwgenerator._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let twgenerator = res.body;

          expect(twgenerator.name).to.equal('Updated Twgenerator');
          expect(twgenerator.info).to.equal('This is the updated twgenerator!!!');

          done();
        });
    });
  });

  describe('PATCH /api/twgenerators/:id', function() {
    var patchedTwgenerator;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/twgenerators/${newTwgenerator._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Twgenerator' },
          { op: 'replace', path: '/info', value: 'This is the patched twgenerator!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTwgenerator = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTwgenerator = {};
    });

    it('should respond with the patched twgenerator', function() {
      expect(patchedTwgenerator.name).to.equal('Patched Twgenerator');
      expect(patchedTwgenerator.info).to.equal('This is the patched twgenerator!!!');
    });
  });

  describe('DELETE /api/twgenerators/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/twgenerators/${newTwgenerator._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when twgenerator does not exist', function(done) {
      request(app)
        .delete(`/api/twgenerators/${newTwgenerator._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
