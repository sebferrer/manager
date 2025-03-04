import { LANGUAGES, fetchConfiguration } from '@ovh-ux/manager-config';

import angular from 'angular';
import { set, kebabCase } from 'lodash-es';

import 'angular-aria';
import 'angular-sanitize';
import 'angular-resource';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ovhOuiAngularTranslations from './translate/ovh-ui-angular';

import 'angular-dynamic-locale';
import 'angular-translate';
import 'angular-translate-loader-pluggable';

import '@ovh-ux/ng-ovh-request-tagger';

import '@uirouter/angularjs';

import ouiConfig from './oui-angular';
import translateFactory from './translate/translate.factory';
import sessionService from './session/session.service';
import redirectionFilter from './redirection/redirection.filter';
import redirectionService from './redirection/redirection.service';
import managerCoreUrlBuilder from './url-builder';

import { registerConfigModule } from './config';
import sanitizeUrl from './sanitize-url/sanitize-url';

import { URLS } from './manager-core.constants';

const moduleName = 'ovhManagerCore';

export default moduleName;

export { URLS };

/**
 * Register core module
 * @param  {Environment}              environment                 The environment instance that will be setted to core.
 * @param  {Object<string, function>} [callbacks={}]              Callbacks that can be configured.
 * @param  {function}                 [callbacks.onLocaleChange]  Function called when the locale change.
 * @return {string}                   The name of the angularJS core module registered.
 */
export const registerCoreModule = (environment, { onLocaleChange } = {}) => {
  const managerCoreConfig = registerConfigModule(environment);

  angular
    .module(moduleName, [
      'ngSanitize',
      'angular-translate-loader-pluggable',
      'ngOvhRequestTagger',
      'pascalprecht.translate',
      'tmh.dynamicLocale',
      managerCoreConfig,
      managerCoreUrlBuilder,
      ngTranslateAsyncLoader,
      ouiConfig,
      ovhOuiAngularTranslations,
      ngOvhHttp,
      ngOvhSsoAuth,
    ])
    .constant('constants', {})
    .constant('CORE_URLS', URLS)
    .factory('TranslateInterceptor', translateFactory)
    .config(
      /* @ngInject */ (
        $translateProvider,
        translatePluggableLoaderProvider,
        coreConfigProvider,
      ) => {
        const defaultLanguage = coreConfigProvider.getUserLocale();
        $translateProvider.useLoader('translatePluggableLoader');

        translatePluggableLoaderProvider.useLoader('asyncLoader');

        $translateProvider.useLoaderCache(true);
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
        $translateProvider.useMissingTranslationHandler(
          'translateMissingTranslationHandler',
        );

        $translateProvider.preferredLanguage(defaultLanguage);

        $translateProvider.use(defaultLanguage);
        $translateProvider.fallbackLanguage(LANGUAGES.fallback);
      },
    )
    .service('SessionService', sessionService)
    .service('RedirectionService', redirectionService)
    .filter('redirection', redirectionFilter)
    // Fix security issue: https://github.com/angular-translate/angular-translate/issues/1418
    .factory(
      'translateMissingTranslationHandler',
      /* @ngInject */ ($sanitize) => (translationId) =>
        $sanitize(translationId),
    )
    .run(
      /* @ngInject */ (tmhDynamicLocaleCache, tmhDynamicLocale, coreConfig) => {
        const injectAngularLocale = (lang) =>
          tmhDynamicLocaleCache.put(
            lang,
            angular.injector(['ngLocale']).get('$locale'),
          );
        const defaultLanguage = coreConfig.getUserLocale();
        const angularLocale = kebabCase(defaultLanguage);

        let angularLocalePromise;
        switch (angularLocale) {
          case 'de-de':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_de-de.js'
            );
            break;
          case 'en-gb':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_en-gb.js'
            );
            break;
          case 'en-us':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_en-us.js'
            );
            break;
          case 'es-es':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_es-es.js'
            );
            break;
          case 'fr-ca':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_fr-ca.js'
            );
            break;
          case 'it-it':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_it-it.js'
            );
            break;
          case 'pl-pl':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_pl-pl.js'
            );
            break;
          case 'pt-pt':
            angularLocalePromise = import(
              'angular-i18n/angular-locale_pt-pt.js'
            );
            break;
          case 'fr-fr':
          default:
            angularLocalePromise = import(
              'angular-i18n/angular-locale_fr-fr.js'
            );
            break;
        }

        angularLocalePromise
          .then(() => injectAngularLocale(angularLocale))
          .then(() => tmhDynamicLocale.set(angularLocale));
      },
    )
    .run(
      /* @ngInject */ ($rootScope, coreConfig) => {
        $rootScope.$on('lang.onChange', (event, { lang }) => {
          if (onLocaleChange) {
            onLocaleChange(lang);
          } else {
            coreConfig.setUserLocale(lang);
            window.location.reload();
          }
        });
      },
    )
    .run(
      /* @ngInject */ ($document, coreConfig) => {
        $document
          .querySelectorAll('html')[0]
          .setAttribute('lang', coreConfig.getUserLanguage());
      },
    )
    .run((ssoAuthentication) => {
      ssoAuthentication.setLoggedIn(environment.getUser());
    })
    .constant(
      'OVH_SSO_AUTH_LOGIN_URL',
      window.location.host === 'www.ovhtelecom.fr'
        ? 'https://www.ovh.com/auth/'
        : '/auth',
    )
    .factory('serviceTypeInterceptor', () => ({
      request(config) {
        const localConfig = config;
        if (/^(\/?engine\/)?2api(-m)?\//.test(localConfig.url)) {
          localConfig.url = localConfig.url.replace(
            /^(\/?engine\/)?2api(-m)?/,
            '',
          );
          localConfig.serviceType = 'aapi';
        }

        if (/^apiv6\//.test(localConfig.url)) {
          localConfig.url = localConfig.url.replace(/^apiv6/, '');
          localConfig.serviceType = 'apiv6';
        }

        return localConfig;
      },
    }))
    .config(
      (ssoAuthenticationProvider, $httpProvider, OVH_SSO_AUTH_LOGIN_URL) => {
        ssoAuthenticationProvider.setLoginUrl(OVH_SSO_AUTH_LOGIN_URL);
        ssoAuthenticationProvider.setLogoutUrl(
          `${OVH_SSO_AUTH_LOGIN_URL}?action=disconnect`,
        );
        ssoAuthenticationProvider.setSignUpUrl(
          `${OVH_SSO_AUTH_LOGIN_URL}/signup/new/`,
        );

        // if (!constants.prodMode) {
        ssoAuthenticationProvider.setUserUrl('/engine/apiv6/me');
        // }

        ssoAuthenticationProvider.setConfig([
          {
            serviceType: 'apiv6',
            urlPrefix: '/engine/apiv6',
          },
          {
            serviceType: 'aapi',
            urlPrefix: '/engine/2api',
          },
          {
            serviceType: 'ws',
            urlPrefix: '/engine/ws',
          },
          {
            serviceType: 'none',
            urlPrefix: '',
          },
        ]);

        $httpProvider.interceptors.push('serviceTypeInterceptor');
        $httpProvider.interceptors.push('OvhSsoAuthInterceptor');
        $httpProvider.interceptors.push('OvhNgRequestTaggerInterceptor');
      },
    )
    .config(
      /* @ngInject */ ($httpProvider) => {
        $httpProvider.interceptors.push('TranslateInterceptor');
      },
    )
    .config((OvhHttpProvider) => {
      // OvhHttpProvider.rootPath = constants.swsProxyPath;
      set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
      set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
      set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
    })
    .config(
      /* @ngInject */ ($urlServiceProvider) => {
        $urlServiceProvider.config.strictMode(false);
      },
    )
    .run(
      /* @ngInject */ (OvhNgRequestTaggerInterceptor, coreConfig) => {
        OvhNgRequestTaggerInterceptor.setHeaderVersion(coreConfig.getVersion());
      },
    )
    .run(
      /* @ngInject */ ($transitions, $translate) => {
        $transitions.onBefore({}, () => $translate.refresh());
      },
    )
    .run(sanitizeUrl)
    .run(
      /* @ngInject */ (coreConfig) => {
        coreConfig.sendSentryUserInformationEvent();
      },
    );

  return moduleName;
};

export const bootstrapApplication = (applicationName) =>
  fetchConfiguration(applicationName);
