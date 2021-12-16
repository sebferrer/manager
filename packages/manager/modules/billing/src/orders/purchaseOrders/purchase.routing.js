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

      dateFormat: /* @ngInject */ ($locale) =>
        $locale.DATETIME_FORMATS.shortDate
          .replace('dd', 'd')
          .replace('MM', 'm')
          .replace('y', 'Y'),

      minDate: /* @ngInject */ () => new Date(),

      minDateForEndDate: /* @ngInject */ (minDate) =>
        minDate.setDate(minDate.getDate() + 1),

      disableDate: /* @ngInject */ (purchase) =>
        purchase.flatMap((elm) => {
          const nbrDays =
            (new Date(elm.endDate).getTime() -
              new Date(elm.startDate).getTime()) /
            (1000 * 3600 * 24);
          const array = [];
          for (let i = 0; i < nbrDays; i += 1) {
            const date = new Date(elm.startDate);
            date.setDate(date.getDate() + i);
            array.push(date);
          }
          return array;
        }),

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

      goToPurchaseOrder: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'app.account.billing.orders.purchase',
          {},
          {
            reload,
          },
        );
        if (message) {
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message)),
          );
        }
        return promise;
      },
    },
  });
};
