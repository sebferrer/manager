import controller from './controller';
import template from './index.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.orders.purchase.add';

  $stateProvider.state(name, {
    url: '/add',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('purchaseOrders_add_page_title'),

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
