import controller from './new-purchase.controller';
import template from './new-purchase.html';

export default {
  bindings: {
    dateFormat: '<',
    disableDate: '<',
    goToPurchaseOrder: '<',
    minDate: '<',
    minDateForEndDate: '<',
  },
  controller,
  template,
};
