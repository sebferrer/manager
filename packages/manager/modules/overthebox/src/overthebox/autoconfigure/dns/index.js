import component from './autoconfigure-dns.component';

const moduleName = 'ovhManagerOtbAutoconfigureDns';

angular
  .module(moduleName, ['ui.router'])
  .component('autoconfigureDns', component);

export default moduleName;
