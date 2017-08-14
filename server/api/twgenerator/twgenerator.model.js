'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './twgenerator.events';

var TwgeneratorSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(TwgeneratorSchema);
export default mongoose.model('Twgenerator', TwgeneratorSchema);
