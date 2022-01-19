import { decimalToFractionStr, INCH_RESULT_FORMATS } from './constants';

describe('MetricApp', () => {
  it('decimalToFractionStr', () => {
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
});
