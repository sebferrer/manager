import component from './overTheBox-autoconfigure.component';
import routing from './overTheBox-autoconfigure.routing';

import dhcp from './dhcp';
import dns from './dns';

const moduleName = 'ovhManagerOtbAutoconfigure';

angular
  .module(moduleName, ['ui.router', dhcp, dns])
  .component('overTheBoxAutoconfigure', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
