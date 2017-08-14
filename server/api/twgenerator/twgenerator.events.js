/**
 * Twgenerator model events
 */

'use strict';

import {EventEmitter} from 'events';
var TwgeneratorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TwgeneratorEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Twgenerator) {
  for(var e in events) {
    let event = events[e];
    Twgenerator.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    TwgeneratorEvents.emit(event + ':' + doc._id, doc);
    TwgeneratorEvents.emit(event, doc);
  };
}

export {registerEvents};
export default TwgeneratorEvents;
