import controller from './website-coach.controller';
import template from './website-coach.html';

export default {
  controller,
  template,
  bindings: {
    activateWebsiteCoach: '<',
    attachedDomains: '<',
    goBack: '<',
    productId: '<',
    screenshot: '<',
    user: '<',
  },
};
