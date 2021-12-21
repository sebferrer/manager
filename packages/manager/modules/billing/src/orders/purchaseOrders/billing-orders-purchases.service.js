export default /* @ngInject */ function billingOrdersPurchasesService(OvhHttp) {
  this.putPurchaseOrder = function putPurchaseOrder(id, data) {
    return OvhHttp.put(`/me/billing/purchaseOrder/${id}`, {
      rootPath: 'apiv6',
      data,
    });
  };
}
