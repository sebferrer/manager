import controller from './billing-orders-purchases.controller';
import template from './billing-orders-purchases.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders.purchases', {
    url: '/purchases?filter',
    params: {
      filter: {
        dynamic: true,
      },
    },
    controller,
    controllerAs: '$ctrl',
    template,
    translations: { value: ['../'], format: 'json' },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('purchaseOrders_page_title'),

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

      dateFormat: /* @ngInject */ ($locale) =>
        $locale.DATETIME_FORMATS.shortDate
          .replace('dd', 'd')
          .replace('MM', 'm')
          .replace('y', 'Y'),

      disableDate: /* @ngInject */ (purchases) =>
        purchases.flatMap((elm) => {
          const nbrDays =
            (new Date(elm.endDate).getTime() -
              new Date(elm.startDate).getTime()) /
            86400000; // (1000 * 3600 * 24);
          const array = [];
          for (let i = 0; i < nbrDays; i += 1) {
            const date = new Date(elm.startDate);
            date.setDate(date.getDate() + i);
            array.push(date);
          }
          return array;
        }),

      filter: /* @ngInject */ ($transition$) => $transition$.params().filter,

      goToEditPurchase: /* @ngInject */ ($state) => (purchase) => {
        $state.go('app.account.billing.orders.purchases.edit-purchase', {
          purchase,
        });
      },

      goToNewPurchase: /* @ngInject */ ($state) => () => {
        $state.go('app.account.billing.orders.purchases.new-purchase');
      },

      goToModalDesactivatePurchase: /* @ngInject */ ($state) => (purchase) => {
        $state.go(
          'app.account.billing.orders.purchases.update-purchase-status',
          { purchase },
        );
      },

      goToPurchaseOrder: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'app.account.billing.orders.purchases',
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

      hideBreadcrumb: /* @ngInject */ () => false,

      minDate: /* @ngInject */ () => new Date(),

      minDateForEndDate: /* @ngInject */ (minDate) =>
        minDate.setDate(minDate.getDate() + 1),

      purchases: /* @ngInject */ (iceberg) =>
        iceberg('/me/billing/purchaseOrder')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('reference', 'ASC')
          .limit(5000)
          .execute(null, true)
          .$promise.then(({ data }) => data),

      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,

      timeNow: /* @ngInject */ ($http) =>
        $http
          .get('/auth/time', { serviceType: 'apiv6' })
          .then((result) => parseInt(result.data, 10))
          .then((timestamp) => moment(timestamp)),

      updateFilterParam: /* @ngInject */ ($state) => (filter) =>
        $state.go(
          'app.account.billing.orders.purchases',
          {
            filter,
          },
          {
            reload: false,
          },
        ),
    },
  });
};
