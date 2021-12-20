export default /* @ngInject */ function BillingOrdersPurchaseUpdatePurchaseStatusService(
  OvhHttp,
) {
  this.putPurchaseOrder = function putPurchaseOrder(id, data) {
    return OvhHttp.put(`/me/billing/purchaseOrder/${id}`, {
      rootPath: 'apiv6',
      data,
    });
  };
}
