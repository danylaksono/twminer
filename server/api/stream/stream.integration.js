'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newStream;

describe('Stream API:', function() {
  describe('GET /api/streams', function() {
    var streams;

    beforeEach(function(done) {
      request(app)
        .get('/api/streams')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          streams = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(streams).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/streams', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/streams')
        .send({
          name: 'New Stream',
          info: 'This is the brand new stream!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStream = res.body;
          done();
        });
    });

    it('should respond with the newly created stream', function() {
      expect(newStream.name).to.equal('New Stream');
      expect(newStream.info).to.equal('This is the brand new stream!!!');
    });
  });

  describe('GET /api/streams/:id', function() {
    var stream;

    beforeEach(function(done) {
      request(app)
        .get(`/api/streams/${newStream._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          stream = res.body;
          done();
        });
    });

    afterEach(function() {
      stream = {};
    });

    it('should respond with the requested stream', function() {
      expect(stream.name).to.equal('New Stream');
      expect(stream.info).to.equal('This is the brand new stream!!!');
    });
  });

  describe('PUT /api/streams/:id', function() {
    var updatedStream;

    beforeEach(function(done) {
      request(app)
        .put(`/api/streams/${newStream._id}`)
        .send({
          name: 'Updated Stream',
          info: 'This is the updated stream!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStream = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStream = {};
    });

    it('should respond with the updated stream', function() {
      expect(updatedStream.name).to.equal('Updated Stream');
      expect(updatedStream.info).to.equal('This is the updated stream!!!');
    });

    it('should respond with the updated stream on a subsequent GET', function(done) {
      request(app)
        .get(`/api/streams/${newStream._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let stream = res.body;

          expect(stream.name).to.equal('Updated Stream');
          expect(stream.info).to.equal('This is the updated stream!!!');

          done();
        });
    });
  });

  describe('PATCH /api/streams/:id', function() {
    var patchedStream;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/streams/${newStream._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Stream' },
          { op: 'replace', path: '/info', value: 'This is the patched stream!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStream = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStream = {};
    });

    it('should respond with the patched stream', function() {
      expect(patchedStream.name).to.equal('Patched Stream');
      expect(patchedStream.info).to.equal('This is the patched stream!!!');
    });
  });

  describe('DELETE /api/streams/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/streams/${newStream._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when stream does not exist', function(done) {
      request(app)
        .delete(`/api/streams/${newStream._id}`)
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
