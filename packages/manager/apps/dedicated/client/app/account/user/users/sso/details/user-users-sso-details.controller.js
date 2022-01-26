export default /* @ngInject */ function UserAccountUsersSSODetailsCtrl(
  $scope,
  $stateParams,
  UseraccountUsersService,
  Alerter,
  $location,
  $translate,
) {

  function getIdentityProvider() {
    console.log("truc");
    return UseraccountUsersService.getIdentityProvider().then((identityProvider) => {
      // this.userIds = userIds;
      $scope.identityProvider = identityProvider;
      console.log('-- IdP --');
      console.log(identityProvider);
    })
    .catch((err) => {
      $scope.identityProvider = null;
      console.log('ERROR');
      console.log(identityProvider);
      console.log(err);
    });
  }

  function init() {
    console.log('ALO');
    getIdentityProvider();
  }

  init();
}
