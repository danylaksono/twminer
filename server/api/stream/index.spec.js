'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var streamCtrlStub = {
  index: 'streamCtrl.index',
  show: 'streamCtrl.show',
  create: 'streamCtrl.create',
  upsert: 'streamCtrl.upsert',
  patch: 'streamCtrl.patch',
  destroy: 'streamCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var streamIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './stream.controller': streamCtrlStub
});

describe('Stream API Router:', function() {
  it('should return an express router instance', function() {
    expect(streamIndex).to.equal(routerStub);
  });

  describe('GET /api/streams', function() {
    it('should route to stream.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'streamCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/streams/:id', function() {
    it('should route to stream.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'streamCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/streams', function() {
    it('should route to stream.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'streamCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/streams/:id', function() {
    it('should route to stream.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'streamCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/streams/:id', function() {
    it('should route to stream.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'streamCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/streams/:id', function() {
    it('should route to stream.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'streamCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
