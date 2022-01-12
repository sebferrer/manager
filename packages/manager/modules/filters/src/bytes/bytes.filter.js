import { convertUnit, getValueFromUnit } from '../helpers/helpers';

export default /* @ngInject */ function() {
  const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const BINARY_UNITS = [
    'B',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  return function bytesFilter(
    value,
    fromUnit,
    toBinary = false,
    precision = 0,
  ) {
    const valueFromUnit = getValueFromUnit(fromUnit, value, toBinary);

    const { multiple, value: convertedValue } = convertUnit(
      valueFromUnit,
      toBinary,
      precision,
    );

    return `${convertedValue}${
      toBinary ? BINARY_UNITS[multiple] : UNITS[multiple]
    }`;
  };
}
