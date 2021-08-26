import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import provider from './provider';
import { CUSTOM_VARIABLES, USER_ID } from './config.constants';

const moduleName = 'ovhManagerAtInternetConfiguration';

const trackingEnabled = __NODE_ENV__ === 'production';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    'ovhManagerCore',
  ])
  .provider('atInternetConfiguration', provider)
  .config(
    /* @ngInject */ (
      atInternetConfigurationProvider,
      atInternetProvider,
      atInternetUiRouterPluginProvider,
      coreConfigProvider,
    ) => {
      atInternetProvider.setEnabled(false);
      atInternetProvider.setDebug(!trackingEnabled);
      atInternetProvider.setRegion(coreConfigProvider.getRegion());

      atInternetUiRouterPluginProvider.setTrackStateChange(true);
      atInternetUiRouterPluginProvider.addStateNameFilter((routeName) => {
        let route = routeName || '';
        atInternetConfigurationProvider.stateRules.forEach((rule) => {
          route = route.replace(rule.pattern, rule.replacement);
        });
        route = route.replace(/\./g, '::');
        return atInternetConfigurationProvider.prefix
          ? `${atInternetConfigurationProvider.prefix}::${route}`
          : route;
      });
    },
  )
  .run(
    /* @ngInject */ ($cookies, $rootScope, $window, atInternet) => {
      $rootScope.$on(
        'cookie-policy:decline',
        (event, { fromModal } = { fromModal: false }) => {
          // initialize atInternet without cookies (enabled === false) and empty tracking queue
          atInternet.setEnabled(trackingEnabled);
          atInternet.clearTrackQueue();
          if ($window.ATInternet) {
            $window.ATInternet.Utils.consentReceived(false); // disable cookie creation
            atInternet.initTag();
            if (fromModal) {
              atInternet.trackClick({
                type: 'action',
                name: 'cookie-banner-manager::decline',
              });
            }
          }
          // disable atInternet
          atInternet.setEnabled(false);
        },
      );

      $rootScope.$on(
        'cookie-policy:consent',
        (event, { fromModal } = { fromModal: false }) => {
          atInternet.setEnabled(trackingEnabled);
          if (trackingEnabled) {
            const cookie = $cookies.get(USER_ID);
            const tag = atInternet.getTag();
            try {
              if (cookie) {
                tag.clientSideUserId.set(cookie);
              } else {
                const value = tag.clientSideUserId.get();
                tag.clientSideUserId.store();

                const element = document.getElementById('manager-tms-iframe');

                if (element) {
                  element.contentWindow.postMessage({
                    id: 'ClientUserId',
                    value,
                  });
                }
              }
              if (fromModal) {
                atInternet.trackClick({
                  type: 'action',
                  name: 'cookie-banner-manager::accept',
                });
              }
            } catch (e) {
              // nothing to do.
            }
          }
        },
      );
    },
  )
  .run(
    /* @ngInject */ (
      $cookies,
      $q,
      atInternet,
      atInternetConfiguration,
      coreConfig,
    ) => {
      const referrerSite = $cookies.get('OrderCloud');
      const data = {
        ...CUSTOM_VARIABLES,
        ...atInternetConfiguration.getConfig(coreConfig.getRegion()),
        ...(referrerSite ? { referrerSite } : {}),
      };
      const me = coreConfig.getUser();
      atInternet.setDefaultsPromise(
        $q.when({
          ...data,
          countryCode: me.country,
          currencyCode: me.currency && me.currency.code,
          visitorId: me.customerCode,
        }),
      );
    },
  )
  .run(
    /* @ngInject */ ($transitions) => {
      /**
       * Use onBefore hook to detect if a transition is starting
       * Use onSuccess to detect when transition complete
       *
       * We use `transitionCompleted` to detect if a transition is started in case of another
       * transition is triggered.
       *
       * Exemple: Some transition redirects to other state, in this case we have (in order):
       * - Transition A - onBefore hook
       * - Transition A redirect to a different state (error state or another)
       * - Transition B - onBefore hook
       * - Transition B - onSuccess hook
       *
       * The `transitionDuration` will contains the duration between Transition A start
       * and Transition B success.
       */
      let transitionCompleted = true;
      let transitionStartTime = 0;
      $transitions.onBefore({}, (transition) => {
        if (transitionCompleted) {
          transitionStartTime = new Date().getTime();
          transitionCompleted = false;
        }

        transition.onSuccess({}, () => {
          const transitionEndTime = new Date().getTime();
          const transitionDuration = transitionEndTime - transitionStartTime;
          transitionCompleted = true;
          // eslint-disable-next-line no-console
          console.log(`transition duration (ms): ${transitionDuration}`);
        });
      });
    },
  );

export default moduleName;
