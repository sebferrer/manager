export default class BillingOrdersPurchaseEditCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $state,
    atInternet,
    purchase,
    BillingOrdersPurchaseEdit,
    goToPurchaseOrder,
    item,
    $locale,
    dateFormat,
    disableDate,
    minDate,
    minDateForEndDate,
  ) {
    this.$translate = $translate;
    this.$state = $state;
    this.atInternet = atInternet;
    this.purchase = purchase;
    this.BillingOrdersPurchaseEdit = BillingOrdersPurchaseEdit;
    this.goToPurchaseOrder = goToPurchaseOrder;
    this.item = item;
    this.$locale = $locale;
    this.dateFormat = dateFormat;
    this.disableDate = disableDate;
    this.minDate = minDate;
    this.minDateForEndDate = minDateForEndDate;

    this.purchase = this.purchase.find((elm) => elm.id === Number(this.item));

    this.model = {
      radioSelection: 'internal_reference',
      inputReference: this.purchase.reference,
      inputStartDate: new Date(this.purchase.startDate),
      inputEndDate: new Date(this.purchase.endDate),
    };
  }

  onCancelEdit() {
    if (this.model.radioSelection === 'internal_reference') {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::modify-internal-ref_cancel`,
        type: 'action',
      });
    } else {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::modify-po_cancel`,
        type: 'action',
      });
    }
    this.$state.go('app.account.billing.orders.purchase');
  }

  OnChangeMinDateForEndDate(selectedDates, dateStr) {
    const date = new Date(dateStr);
    this.minDateForEndDate = date.setDate(date.getDate() + 1);
  }

  onSubmitEdit() {
    if (this.model.radioSelection === 'internal_reference') {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::create-modify-ref_confirm`,
        type: 'action',
      });
    } else {
      this.atInternet.trackClick({
        name: `dedicated::account::billing::modify-po_confirm`,
        type: 'action',
      });
    }

    const data = {
      reference: this.model.inputReference,
      startDate: this.model.inputStartDate,
      endDate: this.model.inputEndDate,
    };

    this.BillingOrdersPurchaseEdit.putPurchaseOrder(this.item, data)
      .then(() => {
        if (this.model.radioSelection === 'internal_reference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::modify-internal-ref_success`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::modify-po_confirm`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_edit_purchase_submit_${this.model.radioSelection}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        if (this.model.radioSelection === 'internal_reference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::modify-internal-ref_error`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::modify-po_success`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant('purchaseOrders_edit_purchase_submit_error'),
          'danger',
        );
      });
  }
}
