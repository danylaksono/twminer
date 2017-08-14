/**
 * Stream model events
 */

'use strict';

import {EventEmitter} from 'events';
var StreamEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StreamEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Stream) {
  for(var e in events) {
    let event = events[e];
    Stream.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    StreamEvents.emit(event + ':' + doc._id, doc);
    StreamEvents.emit(event, doc);
  };
}

export {registerEvents};
export default StreamEvents;
