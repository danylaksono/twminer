import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';


export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/streams')
      .then(response => {
        this.awesomeThings = response.data;
        console.log(response.data)
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  startStream() {
      console.log('start');
      this.$http.post('/api/streams', {
        start: true
      })
  }

  stopStream() {
      console.log('stop');
      this.$http.post('/api/streams', {
        start: false
      })
  }
}

export default angular.module('twminerApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
