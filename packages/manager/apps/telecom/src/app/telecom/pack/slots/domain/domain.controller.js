import { getShellClient } from '../../../../shell';

export default /* @ngInject */ function PackDomainCtrl(
  $scope,
  OvhApiPackXdslDomainActivation,
  $stateParams,
  $window,
  $q,
) {
  const self = this;

  const init = function init() {
    self.details = $scope.service;
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslDomainActivation.v6()
      .query({
        packId: $stateParams.packName,
      })
      .$promise.then((services) => {
        return $q.all(
          services.map((service) => {
            return getShellClient()
              .navigation.getURL('web', '#/configuration/domain/:productId', {
                productId: service,
              })
              .then((webDomainURL) => {
                self.services.push({
                  name: service,
                  encoded: $window.encodeURIComponent(service),
                  tld: service.replace(/^.+\./, '.'),
                  webDomainURL,
                });
              });
          }),
        );
      })
      .finally(() => {
        $scope.loaders.services = false;
      });
  };

  init();
}
