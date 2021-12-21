import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './new-purchase.component';
import routing from './new-purchase.routing';
import service from './new-purchase.service';

const moduleName = 'ovhManagerBillingOrdersPurchaseNew';
angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    ngAtInternet,
  ])
  .component('newPurchase', component)
  .service('newPurchaseService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
