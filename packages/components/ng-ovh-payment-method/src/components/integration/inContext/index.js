import angular from 'angular';

import component from './component';

import administrativeMandate from './administrativeMandate';
import paypal from './paypal';

const moduleName = 'ngOvhPaymentMethodIntegrationInContext';

angular
  .module(moduleName, [administrativeMandate, paypal])
  .component(component.name, component);

export default moduleName;
