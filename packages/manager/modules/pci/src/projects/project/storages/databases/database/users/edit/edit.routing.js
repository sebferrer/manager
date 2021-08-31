import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.users.edit',
    {
      url: '/edit?userId',
      component: 'ovhManagerPciProjectDatabaseUsersEdit',
      resolve: {
        userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
        user: /* @ngInject */ (users, userId) => find(users, { id: userId }),
        breadcrumb: () => null, // Hide breadcrumb
        goBack: /* @ngInject */ (goToUsers) => goToUsers,
      },
    },
  );
};
