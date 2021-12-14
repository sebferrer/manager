export default class BillingOrdersPurchaseAddCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $translate,
    $state,
    atInternet,
    purchase,
    BillingOrdersPurchaseAdd,
    goToPurchaseOrder,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.atInternet = atInternet;
    this.purchase = purchase;
    this.BillingOrdersPurchaseAdd = BillingOrdersPurchaseAdd;
    this.goToPurchaseOrder = goToPurchaseOrder;

    const createMinDate = new Date();
    this.minDate = createMinDate;
    this.minDateForEndDate = createMinDate.setDate(createMinDate.getDate() + 1);
    this.disableDate = this.purchase.flatMap((elm) => {
      const nbrDays =
        (new Date(elm.endDate).getTime() - new Date(elm.startDate).getTime()) /
        (1000 * 3600 * 24);
      const array = [];
      for (let i = 0; i < nbrDays; i += 1) {
        const date = new Date(elm.startDate);
        date.setDate(date.getDate() + i);
        array.push(date);
      }
      return array;
    });

    this.model = {
      radioSelection: 'internal_reference',
      inputReference: '',
      inputStartDate: '',
      inputEndDate: '',
    };
  }

  onCancelAdd() {
    if (this.model.radioSelection === 'internal_reference') {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::create-internal-ref_cancel`,
        type: 'action',
      });
    } else {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::create-po_cancel`,
        type: 'action',
      });
    }
    this.$state.go('app.account.billing.orders.purchase');
  }

  OnChangeMinDateForEndDate(selectedDates, dateStr) {
    const date = new Date(dateStr);
    this.minDateForEndDate = date.setDate(date.getDate() + 1);
  }

  onSubmitAdd() {
    if (this.model.radioSelection === 'internal_reference') {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::create-internal-ref_confirm`,
        type: 'action',
      });
    } else {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::create-po_confirm`,
        type: 'action',
      });
    }

    const data = {
      reference: this.model.inputReference,
      startDate: this.model.inputStartDate,
      endDate: this.model.inputEndDate,
    };

    this.BillingOrdersPurchaseAdd.postPurchaseOrder(data)
      .then(() => {
        if (this.model.radioSelection === 'internal_reference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::create-internal-ref_success`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::create-po_confirm`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_form_add_purchase_submit_${this.model.radioSelection}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        if (this.model.radioSelection === 'internal_reference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::create-internal-ref_error`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::create-po_success`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant(
            'purchaseOrders_form_add_purchase_submit_error',
          ),
          'danger',
        );
      });
  }
}
