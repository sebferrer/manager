import set from 'lodash/set';
import controller from './dns-zone.controller';
import template from './dns-zone.html';

import { getShellClient } from '../../shell';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details', {
    url: '/:productId',
    controller,
    controllerAs: 'ctrlDomain',
    template,
    reloadOnSearch: false,
    resolve: {
      capabilities: /* @ngInject */ (DNSZoneService, serviceName) =>
        DNSZoneService.getCapabilities(serviceName),
      contactManagementLink: /* @ngInject */ (coreConfig, serviceName) =>
        coreConfig.isRegion('EU')
          ? getShellClient().navigation.getURL(
              'dedicated',
              '#/contacts/services',
              {
                serviceName,
              },
            )
          : '',
      currentSection: () => 'zone',
      navigationInformations: /* @ngInject */ (
        currentSection,
        Navigator,
        $rootScope,
      ) => {
        set($rootScope, 'currentSectionInformation', currentSection);
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      emailLink: /* @ngInject */ (serviceName) =>
        getShellClient().navigation.getURL(
          'web',
          `#/email_domain/${serviceName}/mailing-list`,
        ),
    },
    redirectTo: 'app.zone.details.dashboard',
    translations: { value: ['../../domain/dashboard'], format: 'json' },
  });
};
