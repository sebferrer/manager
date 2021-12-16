import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import addModule from './add';
import editModule from './edit';
import ordersPurchaseService from './billing-orders-purchase.service';

import routing from './purchase.routing';

const moduleName = 'ovhManagerBillingOrdersPurchase';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
    addModule,
    editModule,
  ])
  .config(routing)
  .service('BillingOrdersPurchase', ordersPurchaseService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
