import cx from 'classnames';
import type { InputState, DispatchInputState } from './MetricApp';

export enum INCH_RESULT_FORMATS {
  SIXTEENTHS = 'SIXTEENTHS',
  EIGHTHS = 'EIGHTHS',
}

export enum ConversionType {
  fromInch = 'fromInch',
  fromCm = 'fromCm',
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
  reference: ['0.5', '1', '2', '3', '4', '5', '6', '10'],
  fromUnitHeader: 'cm',
  toUnitHeader: 'in',
  fromUnitInline: 'cm',
  toUnitInline: '"',
  mobileKeys: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0'],
  ].flat(),
  sanitizeKeyboardInput: (strInput: string) => {
    return strInput
      .trim()
      .replaceAll(/[^\d\.]/g, '')
      .slice(0, 4);
  },
  parseInput: (cmString: string) => (cmString === '.' ? '0' : cmString),
  handleNewInput: (cmString: string) => {
    if (
      cmString.length === 0 ||
      cmString.match(/\d{4}/) || // prevent pasting in 1234. It's already impossible type this from below rules
      (cmString[0] === '.' && cmString[2] === '.') || // prevent .1.
      (cmString.length >= 2 &&
        cmString[cmString.length - 2] === '.' &&
        cmString[cmString.length - 1] === '.') // prevent 2..
    ) {
      return 'prevent';
    }

    if (
      cmString.match(/^\d{3}$/) || // 123
      cmString.length === 4 || // 12.3, 1.23, 0.12
      (cmString.length === 3 && cmString[0] === '.') // .12
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
  }: {
    conversionOptions: InputState[ConversionType.fromCm]['conversionOptions'];
    dispatchInputState: DispatchInputState;
  }) => (
    <p
      className={cx(
        {
          'bg-stone-700':
            conversionOptions.precision === INCH_RESULT_FORMATS.SIXTEENTHS,
        },
        'px-2 mx-2 rounded'
      )}
      onClick={() => dispatchInputState({ type: 'toggleInchPrecision' })}
    >
      🎯
    </p>
  ),
};
const fromInchImplementation = {
  reference: ['1/4', '3/8', '1/2', '5/8', '1', '2', '5', '10'],
  fromUnitHeader: 'in',
  toUnitHeader: 'cm',
  fromUnitInline: '"',
  toUnitInline: 'cm',
  mobileKeys: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['space', '0', '/'],
  ].flat(),
  parseInput: (inchString: string) => inchString, // TODO:
  handleNewInput: () => {
    // I gotta do some amount of max input size limiting.
    // return 'prevent';
    return 'debounce';
  },
  sanitizeKeyboardInput: (strInput: string) => {
    // Hmm... how to handle input like 7/1 on the way to typing 7/16
    // can i just not let debounce save it as "7"?
    // like... do i really need to support 1 1/15?
    // Oh wait but i definitely need to support normal typing for desktop keyboard.
    // so at minimum I need to do that work. And making mobile input nicer would be extra
    return strInput;
  },
  convert: (
    fromValue: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    conversionOptions: InputState[ConversionType.fromInch]['conversionOptions']
  ) => {
    // TODO: actually handle fraction inputs and whole+fraction
    return `${+fromValue * INCH_TO_CM_RATIO}`;
  },
  OptionsComponent: () => null,
};

export const IMPLEMENTATIONS = {
  [ConversionType.fromCm]: fromCmImplementation,
  [ConversionType.fromInch]: fromInchImplementation,
};
