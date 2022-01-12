import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import bytesFilter from './bytes.filter';

const moduleName = 'ovhManagerFiltersBytes';

angular
  .module(moduleName, [])
  .filter('bytes', bytesFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
