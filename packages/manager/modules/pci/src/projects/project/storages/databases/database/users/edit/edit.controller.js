import get from 'lodash/get';
import intersectionBy from 'lodash/intersectionBy';
import differenceBy from 'lodash/differenceBy';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.availableRoles = differenceBy(this.roles, this.user.roles, 'name');
    this.model = {
      selectedRoles: intersectionBy(this.roles, this.user.roles, 'name'),
    };
  }

  editUser() {
    this.trackDatabases('dashboard::users::edit_a_user::define_role_validate');
    this.processing = true;
    return this.DatabaseService.editUser(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.model.selectedRoles.map((role) => role.name),
    )
      .then((createdUser) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_users_edit_success_message',
            {
              username: createdUser.username,
              password: createdUser.password,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant('pci_databases_users_edit_error_save', {
            message: get(err, 'data.message', null),
          }),
          'error',
        ),
      );
  }

  cancel(trackingCode) {
    this.trackDatabases(trackingCode);
    this.goBack();
  }
}
