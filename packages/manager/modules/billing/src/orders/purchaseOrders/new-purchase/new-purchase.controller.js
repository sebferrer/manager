export default class BillingOrdersPurchaseAddCtrl {
  /* @ngInject */
  constructor($translate, atInternet, newPurchaseService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.newPurchaseService = newPurchaseService;

    this.model = {
      inputEndDate: '',
      inputReference: '',
      inputStartDate: '',
      radioSelection: 'internal_reference',
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
    this.goToPurchaseOrder();
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
      endDate: this.model.inputEndDate,
      reference: this.model.inputReference,
      startDate: this.model.inputStartDate,
    };

    this.newPurchaseService
      .postPurchaseOrder(data)
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
