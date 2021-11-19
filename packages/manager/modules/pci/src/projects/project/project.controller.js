import angular from 'angular';

export default class ProjectController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $uibModal,
    atInternet,
    coreConfig,
    OvhApiCloudProject,
    ovhFeatureFlipping,
    PciProject,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.region = coreConfig.getRegion();
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.PciProject = PciProject;
  }

  $onInit() {
    this.isSidebarOpen = false;

    this.$scope.$on('sidebar:open', () => {
      this.isSidebarOpen = true;
      this.$timeout(() => angular.element('#sidebar-focus').focus());
    });

    this.projectQuotaAboveThreshold = this.quotas.find(
      (quota) => quota.quotaAboveThreshold,
    );

    this.PciProject.setProjectInfo(this.project);
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  isDisplayableLink({ availableForTrustedZone }) {
    const { isTrustedZone } = this;

    return !isTrustedZone || (isTrustedZone && availableForTrustedZone);
  }

  /**
   * finds and returns array of features
   * @param {Array} items
   */
  static findFeatureToCheck(items) {
    return items.reduce((features, item) => {
      return [...features, item.feature].filter((feature) => !!feature);
    }, []);
  }
}
