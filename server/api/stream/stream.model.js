'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './stream.events';

var StreamSchema = new mongoose.Schema({
  tweet: mongoose.Schema.Types.Mixed,
  text: String,
  updated: { type: Date, default: Date.now }
});

registerEvents(StreamSchema);
export default mongoose.model('Stream', StreamSchema);
