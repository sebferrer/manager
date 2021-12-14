import get from 'lodash/get';
import omit from 'lodash/omit';
import set from 'lodash/set';

export default class BillingOrdersPurchaseCtrl {
  /* @ngInject */
  constructor(
    $q,
    $log,
    $translate,
    OvhApiMe,
    schema,
    criteria,
    filter,
    updateFilterParam,
    purchase,
    atInternet,
    $state,
  ) {
    this.$q = $q;
    this.$log = $log;
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
    this.schema = schema;
    this.criteria = criteria || [];
    this.filter = filter;
    this.updateFilterParam = updateFilterParam;
    this.purchase = purchase;
    this.atInternet = atInternet;
    this.$state = $state;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `dedicated::account::billing::orders-internal-ref`,
    });
  }

  getStateEnumFilter() {
    const states = get(
      this.schema.models,
      'me.billing.purchaseOrder.StatusEnum',
    ).enum;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      set(
        filter.values,
        state,
        this.$translate.instant(`purchaseOrders_status_${state}`),
      );
    });

    return filter;
  }

  onCriteriaChange(criteria) {
    this.criteria = criteria;
    try {
      this.filter = encodeURIComponent(
        JSON.stringify(criteria.map((c) => omit(c, 'title'))),
      );
      this.updateFilterParam(this.filter);
    } catch (err) {
      this.$log.error(err);
    }
  }

  addReference() {
    this.atInternet.trackClick({
      name: `dedicated::account::billing::create-internal-ref`,
      type: 'action',
    });
    this.$state.go('app.account.billing.orders.purchase.add');
  }
}
