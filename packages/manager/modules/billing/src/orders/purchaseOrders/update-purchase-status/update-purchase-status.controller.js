export default class BillingOrdersPurchaseUpdatePurchaseStatusCtrl {
  /* @ngInject */
  constructor($translate, atInternet, updatePurchaseStatusService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.updatePurchaseStatusService = updatePurchaseStatusService;
  }

  onCancel() {
    this.goToPurchaseOrder();
  }

  onSubmit() {
    const data = {
      status: 'activated',
    };

    if (this.purchase.type === 'internalReference') {
      this.atInternet.trackPage({
        name: `dedicated::account::billing::deactivate-internal-ref_confirm`,
      });
    } else {
      this.atInternet.trackPage({
        name: `dedicated::account::billing::deactivate-po_confirm`,
      });
    }

    this.updatePurchaseStatusService
      .putPurchaseOrder(this.purchase.id, data)
      .then(() => {
        if (this.purchase.type === 'internalReference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::deactivate-internal-ref_success`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::deactivate-po_success`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_confirmation_desactivation_${this.purchase.type}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        if (this.purchase.type === 'internalReference') {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::deactivate-internal-ref_error`,
          });
        } else {
          this.atInternet.trackPage({
            name: `dedicated::account::billing::deactivate-po_error`,
          });
        }
        this.goToPurchaseOrder(
          this.$translate.instant(
            'purchaseOrders_confirmation_desactivation_error',
          ),
          'danger',
        );
      });
  }
}
