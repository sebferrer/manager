import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import addModule from './add';
import editModule from './edit';
import updatePurchaseStatusModule from './update-purchase-status';
import ordersPurchaseService from './billing-orders-purchase.service';

import routing from './purchase.routing';

const moduleName = 'ovhManagerBillingOrdersPurchase';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    'ui.router',
    addModule,
    editModule,
    updatePurchaseStatusModule,
  ])
  .config(routing)
  .service('BillingOrdersPurchaseService', ordersPurchaseService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
