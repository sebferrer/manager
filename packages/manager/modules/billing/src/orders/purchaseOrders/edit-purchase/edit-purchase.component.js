import controller from './edit-purchase.controller';
import template from './edit-purchase.html';

export default {
  bindings: {
    dateFormat: '<',
    disableDate: '<',
    goToPurchaseOrder: '<',
    minDate: '<',
    minDateForEndDate: '<',
    purchase: '<',
  },
  controller,
  template,
};
