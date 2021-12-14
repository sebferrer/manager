import component from './autoconfigure-dhcp.component';

const moduleName = 'ovhManagerOtbAutoconfigureDhcp';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigureDhcp', component);

export default moduleName;
