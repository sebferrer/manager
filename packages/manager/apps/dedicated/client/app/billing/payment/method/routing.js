import find from 'lodash/find';

import component from './component';

export default /* @ngInject */ (
  $stateProvider,
  $transitionsProvider,
  $urlRouterProvider,
) => {
  const name = 'app.account.billing.payment.method';
  const administrativeMandateFeatureName = 'billing:administrativeMandate';

  $stateProvider.state(name, {
    url: '/method',
    component: component.name,
    resolve: {
      isAdministrativeMandateAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(administrativeMandateFeatureName)
          .then((feature) =>
            feature.isFeatureAvailable(administrativeMandateFeatureName),
          ),

      getActionHref: /* @ngInject */ ($state) => (action, params = {}) => {
        if (action !== 'add') {
          return $state.href(`${name}.action.${action}`, params);
        }
        return $state.href(`${name}.${action}`, params);
      },

      guides: /* @ngInject */ (User) => User.getUrlOf('guides'),

      paymentMethods: /* @ngInject */ (
        isAdministrativeMandateAvailable,
        OVH_PAYMENT_MEAN_STATUS,
        OVH_PAYMENT_METHOD_TYPE,
        ovhPaymentMethod,
      ) =>
        ovhPaymentMethod
          .getAllPaymentMethods({
            transform: true,
          })
          .then((paymentMethods) =>
            paymentMethods.filter(({ paymentType, status }) => {
              if (paymentType !== OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT) {
                return true;
              }

              if (
                paymentType ===
                  OVH_PAYMENT_METHOD_TYPE.ADMINISTRATIVE_MANDATE &&
                !isAdministrativeMandateAvailable
              ) {
                return false;
              }

              return status !== OVH_PAYMENT_MEAN_STATUS.BLOCKED_FOR_INCIDENTS;
            }),
          ),

      goPaymentList: /* @ngInject */ ($timeout, Alerter, $state) => (
        message = null,
        altState = null,
      ) => {
        const reload = message && message.type === 'success';

        const stateGoPromise = $state.go(
          altState || name,
          {},
          {
            reload,
          },
        );

        if (message) {
          stateGoPromise.then(() => {
            $timeout(() =>
              Alerter[message.type](
                message.text,
                'billing_payment_method_alert',
              ),
            );
          });
        }
      },
      breadcrumb: /* @ngInject */ () => null,
      hideBreadcrumb: () => true,
    },
  });

  // add an abstract state that will handle actions on payment method
  $stateProvider.state(`${name}.action`, {
    url: '/{paymentMethodId:int}',
    redirectTo: 'app.account.billing.payment.method',
    resolve: {
      paymentMethod: /* @ngInject */ ($transition$, paymentMethods) =>
        find(paymentMethods, {
          paymentMethodId: $transition$.params().paymentMethodId,
        }),
      breadcrumb: /* @ngInject */ (paymentMethod) => paymentMethod.name,
    },
  });

  $urlRouterProvider.when(/^\/billing\/mean$/, ($location, $state) =>
    $state.go(name),
  );
};
