import get from 'lodash/get';

export default class BillingOrdersMainCtrl {
  /* @ngInject */
  constructor(
    $q,
    $log,
    $translate,
    constants,
    currentUser,
    coreConfig,
    $state,
  ) {
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.billingGuideUrl = get(
      constants.urls[currentUser.ovhSubsidiary],
      'guides.billing',
    );
    this.purchaseOrdersGuideUrl = get(
      constants.urls[currentUser.ovhSubsidiary],
      'guides.purchaseOrders',
    );
  }
}
