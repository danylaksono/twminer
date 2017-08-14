'use strict';

import angular from 'angular';

export default angular.module('twminerApp.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
