import {
  ConversionType,
  decimalToFractionStr,
  IMPLEMENTATIONS,
  INCH_RESULT_FORMATS,
} from './constants';

describe('MetricApp', () => {
  test('decimalToFractionStr', () => {
    const tests = [
      { decimal: 61.01, sixteenths: '61', eighths: '61' },
      { decimal: 1 / 32 - 0.001, sixteenths: '0', eighths: '0' },
      { decimal: 1 / 32, sixteenths: '1/16', eighths: '0' },
      { decimal: 1 / 16 - 0.001, sixteenths: '1/16', eighths: '0' },
      { decimal: 1 / 16, sixteenths: '1/16', eighths: '1/8' },
      { decimal: 2 + 1 / 8, sixteenths: '2 1/8', eighths: '2 1/8' },
      { decimal: 2 + 3 / 16 - 0.001, sixteenths: '2 3/16', eighths: '2 1/8' },
      { decimal: 2.5, sixteenths: '2 1/2', eighths: '2 1/2' },
      { decimal: 2.97, sixteenths: '3', eighths: '3' },
    ];
    tests.forEach(({ decimal, sixteenths, eighths }) => {
      expect(
        decimalToFractionStr(decimal, {
          precision: INCH_RESULT_FORMATS.SIXTEENTHS,
        })
      ).toEqual(sixteenths);
      expect(
        decimalToFractionStr(decimal, {
          precision: INCH_RESULT_FORMATS.EIGHTHS,
        })
      ).toEqual(eighths);
    });
  });

  describe('handleNewInput', () => {
    test('fromCm', () => {
      const { handleNewInput } = IMPLEMENTATIONS[ConversionType.fromCm];
      expect(handleNewInput('00')).toEqual('prevent');
      expect(handleNewInput('1234')).toEqual('prevent');
      expect(handleNewInput('12.345')).toEqual('prevent');
      expect(handleNewInput('.1.')).toEqual('prevent');
      expect(handleNewInput('2..')).toEqual('prevent');
      expect(handleNewInput('1.1.')).toEqual('prevent');

      expect(handleNewInput('123')).toEqual('flush');
      expect(handleNewInput('12.3')).toEqual('flush');
      expect(handleNewInput('1.23')).toEqual('flush');
      expect(handleNewInput('0.12')).toEqual('flush');
      expect(handleNewInput('.12')).toEqual('flush');

      expect(handleNewInput('1')).toEqual('debounce');
      expect(handleNewInput('12')).toEqual('debounce');
      expect(handleNewInput('12.')).toEqual('debounce');
      expect(handleNewInput('1.2')).toEqual('debounce');
      expect(handleNewInput('0.1')).toEqual('debounce');
    });
    test('fromInch', () => {
      const { handleNewInput } = IMPLEMENTATIONS[ConversionType.fromInch];
      expect(handleNewInput(' ')).toEqual('prevent');
      expect(handleNewInput('/')).toEqual('prevent');
      expect(handleNewInput('00')).toEqual('prevent');
      expect(handleNewInput('1  ')).toEqual('prevent');
      expect(handleNewInput('1 1 ')).toEqual('prevent');
      expect(handleNewInput('1 /')).toEqual('prevent');
      expect(handleNewInput('1 5/ ')).toEqual('prevent');
      expect(handleNewInput('1 5//')).toEqual('prevent');
      expect(handleNewInput('1/2/')).toEqual('prevent');
      expect(handleNewInput('1/0')).toEqual('prevent');
      expect(handleNewInput('1/1 ')).toEqual('prevent');
      expect(handleNewInput('1/234')).toEqual('prevent');
      expect(handleNewInput('123/')).toEqual('prevent');
      expect(handleNewInput('0')).toEqual('prevent');
      expect(handleNewInput('1 0')).toEqual('prevent');

      expect(handleNewInput('1/2')).toEqual('flush');
      expect(handleNewInput('1/7')).toEqual('flush'); // prevent two-digit denominators even for nonstandard single-digit denominators
      expect(handleNewInput('5 3/4')).toEqual('flush');
      expect(handleNewInput('5/8')).toEqual('flush');
      expect(handleNewInput('5/16')).toEqual('flush');
      expect(handleNewInput('252')).toEqual('flush');

      expect(handleNewInput('5 ')).toEqual('debounce');
      expect(handleNewInput('5/1')).toEqual('debounce'); // typing 5/16. /1 is the only allowed start for a two-digit denominator
      expect(handleNewInput('25/')).toEqual('debounce');
      expect(handleNewInput('1 25/1')).toEqual('debounce'); // a silly input, but forcing a larger denominator would be awk

      // decimals can be more convenient for desktop
      expect(handleNewInput('1 .')).toEqual('prevent');
      expect(handleNewInput('1.')).toEqual('debounce');
      expect(handleNewInput('1.5')).toEqual('debounce');
      expect(handleNewInput('1.52')).toEqual('flush');
      expect(handleNewInput('1.234')).toEqual('prevent');
      expect(handleNewInput('1 1.')).toEqual('prevent');
    });
  });
});
