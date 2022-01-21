import get from 'lodash/get';

export default class UserAccountUsersConnectSSOAddCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    UseraccountUsersService,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.usersService = UseraccountUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = {
      group: 'DEFAULT',
    };
    this.loader = false;
    this.identityProvider = {
      metadata: null,
      groupAttributeName: null
    }
  }

  $onInit() {
    this.$scope.addSSO = this.addSSO.bind(this);
  }

  addSSO() {
    this.loader = true;

    this.usersService
      .addIdentityProvider(this.identityProvider)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('user_users_connect_sso_add_success_message', {
            login: this.user.login,
          }),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant('user_users_connect_sso_add_error_message')} ${get(
            err,
            'message',
            err,
          )}`,
          'userUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
