import get from 'lodash/get';
import omit from 'lodash/omit';
import set from 'lodash/set';

export default class billingOrdersPurchasesCtrl {
  /* @ngInject */
  constructor(
    $log,
    $translate,
    atInternet,
    billingOrdersPurchasesService,
    criteria,
    filter,
    goToEditPurchase,
    goToModalDesactivatePurchase,
    goToNewPurchase,
    goToPurchaseOrder,
    purchases,
    updateFilterParam,
    schema,
  ) {
    this.$log = $log;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;
    this.criteria = criteria || [];
    this.filter = filter;
    this.goToEditPurchase = goToEditPurchase;
    this.goToModalDesactivatePurchase = goToModalDesactivatePurchase;
    this.goToNewPurchase = goToNewPurchase;
    this.goToPurchaseOrder = goToPurchaseOrder;
    this.purchases = purchases;
    this.schema = schema;
    this.updateFilterParam = updateFilterParam;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `dedicated::account::billing::orders-internal-ref`,
    });

    this.toDay = new Date()
      .toISOString()
      .slice(0, new Date().toISOString().indexOf('T'));
  }

  editPurchase(purchase) {
    this.goToEditPurchase(purchase);
  }

  editPurchaseStatus(purchase) {
    if (purchase.status === 'CREATED') {
      this.goToModalDesactivatePurchase(purchase);
    } else {
      this.purchaseReActivation(purchase);
    }
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

  newPurchase() {
    this.atInternet.trackClick({
      name: `dedicated::account::billing::create-internal-ref`,
      type: 'action',
    });
    this.goToNewPurchase();
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

    this.BillingOrdersPurchasesService.putPurchaseOrder(purchase.id, data)
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
}
