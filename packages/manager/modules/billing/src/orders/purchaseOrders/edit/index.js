import angular from 'angular';

import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerBillingOrdersPurchaseEdit';

angular
  .module(moduleName, [angularTranslate, 'oui', ngTranslateAsyncLoader])
  .config(routing)
  .service('BillingOrdersPurchaseEdit', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
