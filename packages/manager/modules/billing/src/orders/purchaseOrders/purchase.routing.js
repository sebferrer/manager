import controller from './billing-orders-purchase.controller';
import template from './billing-orders-purchase.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders.purchase', {
    url: '/purchase?filter',
    params: {
      filter: {
        dynamic: true,
      },
    },
    template,
    controller,
    controllerAs: '$ctrl',
    translations: { value: ['../'], format: 'json' },
    resolve: {
      purchase: /* @ngInject */ (iceberg) =>
        iceberg('/me/billing/purchaseOrder')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('reference', 'ASC')
          .limit(5000)
          .execute(null, true)
          .$promise.then(({ data }) => data),
      /* @ngInject */
      timeNow: ($http) =>
        $http
          .get('/auth/time', { serviceType: 'apiv6' })
          .then((result) => parseInt(result.data, 10))
          .then((timestamp) => moment(timestamp)),
      filter: /* @ngInject */ ($transition$) => $transition$.params().filter,
      criteria: /* @ngInject */ ($log, filter) => {
        if (filter) {
          try {
            const criteria = JSON.parse(decodeURIComponent(filter));
            if (!Array.isArray(criteria)) throw new Error('Invalid criteria');
            return criteria;
          } catch (err) {
            $log.error(err);
          }
        }
        return undefined;
      },
      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,

      updateFilterParam: /* @ngInject */ ($state) => (filter) =>
        $state.go(
          'app.account.billing.orders.purchase',
          {
            filter,
          },
          {
            reload: false,
          },
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('purchaseOrders_page_title'),
      hideBreadcrumb: () => false,
    },
  });
};
