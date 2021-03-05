import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';

const moduleName =
  'ngOvhPaymentMethodIntegrationInContextAdministrativeMandate';

angular
  .module(moduleName, [])
  .component(
    'ovhPaymentMethodIntegrationInContextAdministrativeMandate',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
