export default /* @ngInject */ function billingOrdersPurchaseNew(OvhHttp) {
  this.postPurchaseOrder = function postPurchaseOrder(data) {
    return OvhHttp.post('/me/billing/purchaseOrder', {
      rootPath: 'apiv6',
      data,
    });
  };
}
