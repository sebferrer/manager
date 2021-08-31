import controller from './edit.controller';
import template from './edit.html';

export default {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    roles: '<',
    trackDatabases: '<',
    user: '<',
  },
  controller,
  template,
};
