import { isTopLevelApplication } from '@ovh-ux/manager-config';

import { getShellClient } from './shell';

export default class PublicCloudController {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    $state,
    $timeout,
    $window,
    atInternet,
    coreConfig,
    ovhUserPref,
    publicCloud,
    ovhFeatureFlipping,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$window = $window;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.ovhUserPref = ovhUserPref;
    this.publicCloud = publicCloud;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.isTopLevelApplication = isTopLevelApplication();

    this.chatbotEnabled = false;
    this.shell = getShellClient();

    $scope.$on('oui-step-form.submit', (event, { form }) => {
      this.atInternet.trackClick({
        name: form.$name,
        type: 'action',
      });
    });
  }

  $onInit() {
    this.currentLanguage = this.coreConfig.getUserLanguage();
    this.user = this.coreConfig.getUser();

    this.shell.ux.onRequestClientSidebarOpen(() =>
      this.$timeout(() => this.openSidebar()),
    );

    const unregisterListener = this.$scope.$on('app:started', () => {
      const CHATBOT_FEATURE = 'chatbot';
      this.ovhFeatureFlipping
        .checkFeatureAvailability(CHATBOT_FEATURE)
        .then((featureAvailability) => {
          this.chatbotEnabled = featureAvailability.isFeatureAvailable(
            CHATBOT_FEATURE,
          );
          if (this.chatbotEnabled) {
            this.$rootScope.$broadcast(
              'ovh-chatbot:enable',
              this.chatbotEnabled,
            );
          }
        });
      unregisterListener();
    });
  }

  openSidebar() {
    this.$scope.$broadcast('sidebar:open');
  }

  onChatbotOpen() {
    this.shell.ux.onChatbotOpen();
  }

  onChatbotClose(reduced) {
    this.shell.ux.onChatbotClose(reduced);
  }
}
