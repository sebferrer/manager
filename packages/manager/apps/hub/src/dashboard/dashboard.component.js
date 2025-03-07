import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  bindings: {
    bills: '<',
    debt: '<',
    me: '<',
    billingServices: '<',
    expand: '<',
    showLivechat: '<',
    expandProducts: '<',
    notifications: '<',
    order: '<',
    products: '<',
    refresh: '<',
    refreshBillingServices: '<',
    refreshOrder: '<',
    services: '<',
    tickets: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
