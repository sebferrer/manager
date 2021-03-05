import controller from './controller';
import template from './index.html';

export default {
  controller,
  require: {
    inContextCtrl: '^ovhPaymentMethodIntegrationInContext',
  },
  template,
};
