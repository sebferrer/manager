import { REDEPLOY_INPUT, TRACKING_PREFIX } from './constants';
import { REDEPLOY_CONFIG_OPTIONS } from '../constants';

export default class RedeployConfirmController {
  constructor($translate, atInternet, NutanixService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.NutanixService = NutanixService;
    this.REDEPLOY_INPUT = REDEPLOY_INPUT;
  }

  $onInit() {
    this.isRedeploying = false;
  }

  trackClick(label) {
    this.atInternet.trackClick({
      type: 'action',
      name: `${TRACKING_PREFIX}::${label}`,
    });
  }

  redeployCluster() {
    this.trackClick(
      this.redeployMethod === REDEPLOY_CONFIG_OPTIONS.CUSTOM
        ? 'confirm_personalized-configuration'
        : 'confirm_saved-configuration',
    );
    this.isRedeploying = true;
    return this.NutanixService.updateCluster(
      this.serviceName,
      true,
      this.redeployConfig,
    ).then(() => {
      const promise = this.goToNutanixGeneralInfo();
      this.isRedeploying = false;
      promise.then(() => {
        this.atInternet.trackPage({
          name: 'hpc::nutanix::cluster-redeploy-inprogress',
        });
      });
    });
  }

  cancelRedeploy() {
    this.trackClick('cancel');
    this.goBack();
  }
}
