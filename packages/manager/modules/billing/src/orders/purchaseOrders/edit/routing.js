import controller from './controller';
import template from './index.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders.purchase.edit', {
    url: '/edit?id',
    params: {
      id: null,
    },
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('purchaseOrders_edit_page_title'),

      item: /* @ngInject */ ($transition$) => $transition$.params().id,
    },
  });
};
