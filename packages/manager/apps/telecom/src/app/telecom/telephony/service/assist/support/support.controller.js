import { getShellClient } from '../../../../../shell';

export default /* @ngInject */ function TelecomTelephonyServiceAssistSupportCtrl(
  $stateParams,
  TelephonyMediator,
  URLS,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.service = null;
  self.guideUrl = URLS.guides.telephony;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then(() => {
        self.service = TelephonyMediator.findService($stateParams.serviceName);
        return getShellClient().navigation.getURL('dedicated', '#/support');
      })
      .then((supportUrl) => {
        self.supportUrl = supportUrl;
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
