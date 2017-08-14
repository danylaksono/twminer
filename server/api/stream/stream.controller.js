/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/streams              ->  index
 * POST    /api/streams              ->  create
 * GET     /api/streams/:id          ->  show
 * PUT     /api/streams/:id          ->  upsert
 * PATCH   /api/streams/:id          ->  patch
 * DELETE  /api/streams/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Stream from './stream.model';


//testing tw
// ================== twmining start ====================

var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('./my.twitter.credentials.json');
var client = new TwitterStreamChannels(credentials);

var channels = {
  "peatfire": ['gambut', 'kebakaran', 'peat', 'lahan gambut', 'indonesia']
};
/*
var twstream = client.streamChannels({track:channels});
twstream.on('channels/peatfire',function(tweet){
    console.log('>peatfire:  ',tweet.text);
});

setTimeout(function(){
    twstream.stop();//closes the stream connected to Twitter
	console.log('>stream closed after 100 seconds');
},100000);
*/
var currentStream = {};

export function stream(req, res) {
  var twstream = client.streamChannels({
    track: channels
  });

  if (req.body.start) {
    console.log(req.body);
    //twstream.on('tweet', function(tweet) {
    //});
    twstream.on('channels/peatfire', function(tweet) {
        currentStream = twstream;
        console.log(tweet.text);
        create(tweet, res);
    });

  } else {
    console.log(currentStream);
    setTimeout(function() {
      //twstream.stop();//closes the stream connected to Twitter
      currentStream.stop();
      console.log('>stream closed after 10 seconds');
    }, 10000);
  }
}

// ================== twmining ====================


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}



function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Streams
export function index(req, res) {
  return Stream.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Stream from the DB
export function show(req, res) {
  return Stream.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Stream in the DB
export function create(req, res) {
  //return Stream.create(req.body)
  return Stream.create(req)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Stream in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Stream.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

  .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Stream in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Stream.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Stream from the DB
export function destroy(req, res) {
  return Stream.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
