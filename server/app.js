/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import seedDatabaseIfNeeded from './config/seed';

//testing twitter
/*
var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('./config/environment/my.twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);
console.log(client);

var channels = {
	"languages" : ['javascript','php','java','python','perl'],
	"js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
	"web" : ['javascript','nodejs','html5','css','angularjs']
};
var stream = client.streamChannels({track:channels});
stream.on('channels/languages',function(tweet){
    console.log('>languages',tweet.text);//any tweet with 'javascript','php','java','python','perl'
});
stream.on('channels/js-frameworks',function(tweet){
    console.log('>frameworks',tweet.text);//any tweet with 'angularjs','jquery','backbone','emberjs'
});
stream.on('channels/web',function(tweet){
    console.log('>web',tweet.text);//any tweet with 'javascript','nodejs','html5','css','angularjs'
});

setTimeout(function(){
    stream.stop();//closes the stream connected to Twitter
	console.log('>stream closed after 100 seconds');
},100000);
*/

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

seedDatabaseIfNeeded();
setImmediate(startServer);

// Expose app
exports = module.exports = app;
