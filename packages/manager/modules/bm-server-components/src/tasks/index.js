import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './component';

const moduleName = 'ovhManagerDedicatedServerTasksComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    ovhManagerCore,
  ])
  .component('serverTasks', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
