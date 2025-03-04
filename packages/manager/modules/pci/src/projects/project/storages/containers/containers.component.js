import controller from './containers.controller';
import template from './containers.html';

export default {
  controller,
  template,
  bindings: {
    addContainer: '<',
    archive: '<',
    containerLink: '<',
    containers: '<',
    containerId: '<',
    deleteContainer: '<',
    goToAddUserContainer: '<',
    goToStorageContainers: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    onListParamChange: '<',
    projectId: '<',
    viewContainer: '<',
    getStateName: '<',
    steins: '<',
    userList: '<',
    allUserList: '<',
    customerRegions: '<',
    containersRegions: '<',
    goToRegion: '<',
    trackingPrefix: '<',
    refreshContainers: '<?',
  },
};
