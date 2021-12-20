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
    goToModalDesactivatePurchase,
    BillingOrdersPurchaseService,
    goToPurchaseOrder,
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
    this.goToModalDesactivatePurchase = goToModalDesactivatePurchase;
    this.BillingOrdersPurchaseService = BillingOrdersPurchaseService;
    this.goToPurchaseOrder = goToPurchaseOrder;

    this.toDay = new Date()
      .toISOString()
      .slice(0, new Date().toISOString().indexOf('T'));
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

  editReference(item) {
    this.$state.go('app.account.billing.orders.purchase.edit', item);
  }

  editPurchaseStatus(purchase) {
    if (purchase.status === 'CREATED') {
      this.goToModalDesactivatePurchase(purchase);
    } else {
      this.purchaseReActivation(purchase);
    }
  }

  purchaseReActivation(purchase) {
    const data = {
      status: 'activated',
    };

    if (purchase.type === 'internalReference') {
      this.atInternet.trackPage({
        name: `dedicated::account::billing::reactivate-internal-ref`,
      });
    } else {
      this.atInternet.trackPage({
        name: `dedicated::account::billing::reactivate-po`,
      });
    }

    this.BillingOrdersPurchaseService.putPurchaseOrder(purchase.id, data)
      .then(() => {
        if (purchase.type === 'internalReference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::reactivate-internal-ref_success`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::reactivate-po_success`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_confirmation_reactivation_${purchase.type}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        if (purchase.type === 'internalReference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::reactivate-internal-ref_error`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::reactivate-po_error`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant(
            'purchaseOrders_confirmation_reactivation_error',
          ),
          'danger',
        );
      });
  }

  getStatus($row) {
    let status = '';
    if (
      $row.status === 'CREATED' &&
      $row.startDate <= this.toDay &&
      this.toDay <= $row.endDate
    ) {
      status = this.$translate.instant('purchaseOrders_status_CREATED_on');
    } else if (
      $row.status === 'CREATED' &&
      !($row.startDate <= this.toDay && this.toDay <= $row.endDate)
    ) {
      status = this.$translate.instant('purchaseOrders_status_CREATED_off');
    } else {
      status = this.$translate.instant('purchaseOrders_status_DELETED');
    }
    return status;
  }
}
