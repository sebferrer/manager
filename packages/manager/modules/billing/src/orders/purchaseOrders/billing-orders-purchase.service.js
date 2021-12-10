import forOwn from 'lodash/forOwn';

export default /* @ngInject */ function BillingOrdersPurchase(
  $http,
  $q,
  $cacheFactory,
  OvhHttp,
) {
  const self = this;
  let currentTimePromise;
  const cache = {
    purchase: 'UNIVERS_BILLING_ORDERS_PURCHASE',
  };

  this.init = function init() {
    currentTimePromise = $http
      .get('/auth/time', { serviceType: 'apiv6' })
      .then((result) => parseInt(result.data, 10))
      .then((timestamp) => moment(timestamp));
  };

  this.getPurchase = function getPurchase(opts) {
    if (opts.forceRefresh) {
      self.clearCache();
    }
    return OvhHttp.get('/me/billing/purchaseOrder', {
      rootPath: 'apiv6',
      cache: cache.purchase,
    });
  };

  this.getPurchaseDetail = function getPurchaseDetail(purchaseId) {
    const propertiesPromise = OvhHttp.get('/me/billing/purchaseOrder/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id: purchaseId,
      },
      cache: cache.purchase,
    });

    return $q
      .all({
        properties: propertiesPromise,
        currentTime: currentTimePromise,
      })
      .then((results) => {
        const purchase = results.properties;
        return purchase;
      });
  };

  this.clearCache = function clearCache() {
    forOwn(cache, (cacheName) => {
      const cacheInstance = $cacheFactory.get(cacheName);
      if (cacheInstance) {
        cacheInstance.removeAll();
      }
    });
  };

  this.init();
}
