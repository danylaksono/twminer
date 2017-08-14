'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var twgeneratorCtrlStub = {
  index: 'twgeneratorCtrl.index',
  show: 'twgeneratorCtrl.show',
  create: 'twgeneratorCtrl.create',
  upsert: 'twgeneratorCtrl.upsert',
  patch: 'twgeneratorCtrl.patch',
  destroy: 'twgeneratorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var twgeneratorIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './twgenerator.controller': twgeneratorCtrlStub
});

describe('Twgenerator API Router:', function() {
  it('should return an express router instance', function() {
    expect(twgeneratorIndex).to.equal(routerStub);
  });

  describe('GET /api/twgenerators', function() {
    it('should route to twgenerator.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'twgeneratorCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/twgenerators/:id', function() {
    it('should route to twgenerator.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'twgeneratorCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/twgenerators', function() {
    it('should route to twgenerator.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'twgeneratorCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/twgenerators/:id', function() {
    it('should route to twgenerator.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'twgeneratorCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/twgenerators/:id', function() {
    it('should route to twgenerator.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'twgeneratorCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/twgenerators/:id', function() {
    it('should route to twgenerator.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'twgeneratorCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
