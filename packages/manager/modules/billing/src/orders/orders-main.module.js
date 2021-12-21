import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import billingOrders from './orders/orders.module';
import billingOrdersPurchases from './purchaseOrders/billing-orders-purchases.module';

import routing from './orders-main.routing';

const moduleName = 'ovhManagerBillingOrdersMain';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
    billingOrders,
    billingOrdersPurchases,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
