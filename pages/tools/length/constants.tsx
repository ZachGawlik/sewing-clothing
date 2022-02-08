import type { InputState, DispatchInputState } from './MetricApp';

export enum INCH_RESULT_FORMATS {
  SIXTEENTHS = 'SIXTEENTHS',
  EIGHTHS = 'EIGHTHS',
}

export enum ConversionType {
  fromInch = 'fromInch',
  fromCm = 'fromCm',
}

export enum InlineUnit {
  cm = 'cm',
  '"' = '"',
}

const INCH_TO_CM_RATIO = 2.54;

/* ========================= fromCm ======================================== */

export function reduceFraction(numerator: number, denominator: number) {
  function getGcd(a: number, b: number): number {
    return b ? getGcd(b, a % b) : a;
  }
  const gcd = getGcd(numerator, denominator);
  return [numerator / gcd, denominator / gcd];
}

const decimalToFraction = (inchDecimal: number, precision: number) => {
  const whole = Math.floor(inchDecimal);
  const initialNumerator = Math.round((inchDecimal % 1) * precision);
  if (initialNumerator === 0) {
    return { whole, numerator: 0, denominator: precision };
  } else if (initialNumerator === precision) {
    return { whole: whole + 1, numerator: 0, denominator: precision };
  }

  const [numerator, denominator] = reduceFraction(initialNumerator, precision);
  return { whole, numerator, denominator };
};

// parseInput = massage current input to some understandable value to convert
// handleNewInput = whether it allows new keypress, paste, or mobile key touch
// sanitizeKeyboardInput, if desired, could be put into handleNewInput. Those lines aren't necessary for mobile keyboard
// Separating these prevent disrupting input as user types
//  e.g. user typing 01 instead of "1", or plainly "."
export const decimalToFractionStr = (
  inchDecimal: number,
  conversionOptions: { precision: INCH_RESULT_FORMATS }
) => {
  const { whole, numerator, denominator } = decimalToFraction(
    inchDecimal,
    conversionOptions.precision === INCH_RESULT_FORMATS.EIGHTHS ? 8 : 16
  );
  if (numerator === 0) {
    return `${whole}`;
  } else if (whole === 0) {
    return `${numerator}/${denominator}`;
  }
  return `${whole} ${numerator}/${denominator}`;
};
const fromCmImplementation = {
  reference: ['0.5', '1', '1.5', '2', '2.5', '3', '4', '5', '30', '100'],
  fromUnitInline: InlineUnit['cm'],
  fromUnitHeader: 'cm',
  toUnitHeader: 'in',
  toUnitInline: InlineUnit['"'],
  mobileKeys: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0'],
  ].flat(),
  sanitizeKeyboardInput: (strInput: string) => {
    return strInput.trim().replaceAll(/[^\d\.]/g, '');
  },
  parseInput: (cmString: string) => (cmString === '.' ? '0' : cmString),
  handleNewInput: (cmString: string) => {
    if (
      cmString.length >= 5 ||
      cmString.match(/\d{4}/) || // prevent pasting in 1234. It's already impossible type this from below rules
      cmString.match(/^00/) ||
      cmString.match(/\..*\./)
    ) {
      return 'prevent';
    }

    if (
      cmString.match(/\d{3}/) || // 123
      cmString.match(/\.\d/) || // .1
      cmString.length === 4 // 12.3
    ) {
      return 'flush';
    } else {
      // e.g. "1" "12." "1.2" "0.1"
      return 'debounce';
    }
  },
  convert: (
    fromValue: string,
    conversionOptions: InputState[ConversionType.fromCm]['conversionOptions']
  ) => {
    return decimalToFractionStr(
      +fromValue / INCH_TO_CM_RATIO,
      conversionOptions
    );
  },
  OptionsComponent: ({
    conversionOptions,
    dispatchInputState,
    onClick,
  }: {
    conversionOptions: InputState[ConversionType.fromCm]['conversionOptions'];
    dispatchInputState: DispatchInputState;
    onClick: () => void;
  }) => (
    <div className="flex justify-center">
      <button
        type="button"
        aria-label="Toggle on to display output to 1/16 precision"
        className="p-2 rounded select-none font-sans text-sm"
        onClick={() => {
          dispatchInputState({ type: 'toggleInchPrecision' });
          onClick();
        }}
      >
        <div className="text-gray-300">
          <sup>x</sup>&frasl;
          <sub>
            {conversionOptions.precision === INCH_RESULT_FORMATS.SIXTEENTHS
              ? 16
              : 8}
          </sub>
        </div>
      </button>
    </div>
  ),
};

/* ========================= fromInch ======================================== */
const toFixed = (num: number, precision: number) => {
  // .toFixed() does rounding. e.g. 5.995 will return "6"
  const fixed = num.toFixed(precision);
  return +fixed === Math.round(+fixed) ? `${Math.round(+fixed)}` : fixed;
};

const fromInchImplementation = {
  reference: ['1/8', '1/4', '3/8', '1/2', '5/8', '1', '1 1/2', '2', '5', '36'],
  fromUnitHeader: 'in',
  toUnitHeader: 'cm',
  fromUnitInline: InlineUnit['"'],
  toUnitInline: InlineUnit['cm'],
  mobileKeys: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [' ', '0', '/'],
  ].flat(),
  parseInput: (cmString: string) => (cmString === '.' ? '0' : cmString),
  handleNewInput: (inchString: string) => {
    // TODO: At some point will  want to translate some of these "can't add space next" "can't add slash next"
    //       as legit disabling the mobile key input button. Not sure how to do that in a way that isn't distracting
    //       and in a way that could maybe reuse some of this logic that needs to exist for desktop input
    if (
      inchString.match(/^ /) ||
      inchString.match(/^\//) ||
      inchString.match(/^0/) ||
      inchString.match(/ 0/) ||
      inchString.match(/[^\d \/\.]/) ||
      inchString.match(/[^\d]\./) || // "1 ."
      inchString.match(/\..*[^\d]/) || // "1. "
      inchString.match(/\s.*\s/) || // "1 1 "
      inchString.match(/\s\//) || // "1 /"
      inchString.match(/\/0/) || // "1/0 "
      inchString.match(/\/.*([^\d])/) || // "1/ " "1//" "1/1 "
      inchString.match(/\.\d{3}/) || // 1.234
      inchString.match(/\/\d{3}/) || // 1/234
      inchString.match(/^\d{3}.+/) || // 123/
      inchString.match(/ .*\./) // 1 1.2
    ) {
      return 'prevent';
    }

    if (
      inchString.match(/.*\/[2-9]/) ||
      inchString.match(/.*\/1[0-9]/) ||
      inchString.match(/\.\d\d/) || // 1.52
      inchString.match(/\d\d\d+/)
    ) {
      return 'flush';
    }

    return 'debounce';
  },
  sanitizeKeyboardInput: (strInput: string) => {
    return strInput.replaceAll(/[^\d \/\.]/g, '');
  },
  convert: (
    inchInput: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    conversionOptions: InputState[ConversionType.fromInch]['conversionOptions']
  ) => {
    const fromValue = inchInput.trim();
    let inch;
    if (fromValue.match(/^\d*$/)) {
      inch = +fromValue;
    } else {
      const [whole, fraction] = fromValue.includes(' ')
        ? fromValue.split(' ')
        : [0, fromValue];
      const [num, den] = fraction.split('/');
      inch = +whole + +num / (+den || 1);
    }
    const cm = inch * INCH_TO_CM_RATIO;
    return cm > 100 ? `${Math.round(cm)}` : toFixed(cm, cm < 1 ? 2 : 1);
  },
};

export const INLINE_UNIT_TO_COLOR = {
  [InlineUnit['"']]: {
    text: '#fda4af', // text-rose-300
    mobileKeyBorder: '#44403c', // stone-700
    mobileKeyBg: '#1c1917', // stone-900
  },
  [InlineUnit['cm']]: {
    text: '#d8b4fe', // purple-300
    mobileKey: '#d8b4fe', // purple-100
    mobileKeyBorder: '#334155', // slate-700
    mobileKeyBg: '#0f172a', // slate-900
  },
};

export const IMPLEMENTATIONS = {
  [ConversionType.fromCm]: fromCmImplementation,
  [ConversionType.fromInch]: fromInchImplementation,
};
