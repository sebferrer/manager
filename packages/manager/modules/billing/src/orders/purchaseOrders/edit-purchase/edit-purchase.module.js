import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './edit-purchase.component';
import routing from './edit-purchase.routing';
import service from './edit-purchase.service';

const moduleName = 'ovhManagerBillingOrdersPurchaseEdit';
angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    ngAtInternet,
  ])
  .component('editPurchase', component)
  .service('editPurchaseService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
