export default class BillingOrdersPurchaseEditCtrl {
  /* @ngInject */
  constructor($translate, atInternet, editPurchaseService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.editPurchaseService = editPurchaseService;
  }

  $onInit() {
    this.model = {
      inputEndDate: new Date(this.purchase.endDate),
      inputReference: this.purchase.reference,
      inputStartDate: new Date(this.purchase.startDate),
      radioSelection: 'internal_reference',
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
    this.goToPurchaseOrder();
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
      endDate: this.model.inputEndDate,
      reference: this.model.inputReference,
      startDate: this.model.inputStartDate,
    };

    this.editPurchaseService
      .putPurchaseOrder(this.purchase.id, data)
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
