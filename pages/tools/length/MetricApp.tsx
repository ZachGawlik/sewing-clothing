import * as React from 'react';
import cx from 'classnames';
import { css } from '@emotion/react';
import Link from 'next/link';
import { useAppHeight } from 'utils/hooks';
import debounce from 'lodash/debounce';
import immer from 'immer';

enum ConversionType {
  fromInch = 'fromInch',
  fromCm = 'fromCm',
}

const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(mql.matches);
    mql.onchange = (e) => {
      setIsTouchDevice(e.matches);
    };
    return () => {
      mql.onchange = null;
    };
  }, []);
  return isTouchDevice;
};

const MOBILE_KEYS = {
  [ConversionType.fromInch]: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['space', '0', '/'],
  ].flat(),
  [ConversionType.fromCm]: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0'],
  ].flat(),
};
const mobileKeyDuration = 200;
const MobileKey = ({
  value,
  onClick,
}: {
  value: string;
  onClick: (key: string) => void;
}) => {
  const [clicked, setClicked] = React.useState<boolean>(false);
  const debounceUnclick = React.useMemo(
    () => debounce(() => setClicked(false), mobileKeyDuration),
    []
  );

  return (
    <div
      css={css`
        transition: ${clicked ? '0ms' : `${mobileKeyDuration}ms`}
          background-color ease-out;
      `}
      className={cx(
        'flex justify-center items-center rounded-md bg-zinc-700 shadow-md',
        { 'bg-zinc-500': clicked }
      )}
      onClick={() => {
        setClicked(true);
        onClick(value);
        debounceUnclick();
      }}
    >
      <span>{value}</span>
    </div>
  );
};

/* Rest */

export function reduceFraction(numerator: number, denominator: number) {
  function getGcd(a: number, b: number): number {
    return b ? getGcd(b, a % b) : a;
  }
  const gcd = getGcd(numerator, denominator);
  return [numerator / gcd, denominator / gcd];
}

/*
TODOS:
 * Inch -> cm input.
 * Quick improvements for tablet
 * Uhhhhhh yards <-> meters?
*/

const parseToDecimal = (strInput: string) => {
  return strInput === '.'
    ? 0
    : parseFloat(parseFloat(strInput.trim()).toFixed(2));
};

export enum INCH_RESULT_FORMATS {
  SIXTEENTHS = 'SIXTEENTHS',
  EIGHTHS = 'EIGHTHS',
}

const INCH_TO_CM_RATIO = 2.54;

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

const initialInputState = {
  shouldShowEmptyInput: true,
  activeConversion: ConversionType.fromCm,
  [ConversionType.fromCm]: {
    history: [],
    conversionOptions: {
      precision: INCH_RESULT_FORMATS.EIGHTHS,
    },
  },
  [ConversionType.fromInch]: {
    history: [],
    conversionOptions: {},
  },
};

type InputState = {
  shouldShowEmptyInput: boolean;
  activeConversion: ConversionType;

  [ConversionType.fromCm]: {
    history: Array<number>;
    conversionOptions: {
      precision: INCH_RESULT_FORMATS;
    };
  };
  [ConversionType.fromInch]: {
    history: Array<number>;
    conversionOptions: Record<string, never>;
  };
};

type InputActionType =
  | { type: 'add'; payload: number }
  | { type: 'load'; payload: InputState }
  | { type: 'toggleUnits' }
  | { type: 'toggleInchPrecision' };

const inputReducer = (state: InputState, action: InputActionType) => {
  switch (action.type) {
    case 'load':
      return {
        ...action.payload,
        shouldShowEmptyInput: true,
      };
    case 'add':
      return immer(state, (draft) => {
        draft.shouldShowEmptyInput = false;
        draft[draft.activeConversion].history.unshift(action.payload);
        draft[draft.activeConversion].history.splice(10);
      });
    case 'toggleUnits':
      return immer(state, (draft) => {
        draft.shouldShowEmptyInput = true;
        draft.activeConversion =
          draft.activeConversion === ConversionType.fromCm
            ? ConversionType.fromInch
            : ConversionType.fromCm;
      });
    case 'toggleInchPrecision':
      if (state.activeConversion !== ConversionType.fromCm) {
        throw new Error(
          'Cannot change inch output precision when not converting from cm'
        );
      }
      return immer(state, (draft) => {
        draft[ConversionType.fromCm].conversionOptions.precision =
          draft[ConversionType.fromCm].conversionOptions.precision ===
          INCH_RESULT_FORMATS.EIGHTHS
            ? INCH_RESULT_FORMATS.SIXTEENTHS
            : INCH_RESULT_FORMATS.EIGHTHS;
      });
    default:
      throw new Error();
  }
};

const useInputState = () => {
  const [inputState, dispatchInputState] = React.useReducer(
    inputReducer,
    initialInputState
  );

  const localStorageKey = 'inputState';
  React.useEffect(() => {
    try {
      const storedHistory = window.localStorage.getItem(localStorageKey);
      if (storedHistory) {
        const parsedStoredHistory = JSON.parse(storedHistory) as InputState;
        dispatchInputState({
          type: 'load',
          payload: parsedStoredHistory,
        });
      }
    } catch (e) {}
  }, []);
  React.useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(inputState));
  }, [inputState]);

  return {
    inputState,
    dispatchInputState,
  };
};

// sanitizeKeyboardInput = Determines if something is allowed to be raw input
// parseInput = Actually understand raw input to store and convert
// Separating these prevent disrupting input as user types
//  e.g. user typing 01 instead of "1"
const ConversionImplemention = {
  [ConversionType.fromCm]: {
    reference: [0.5, 1, 2, 3, 4, 5, 6, 10],
    fromUnitHeader: 'cm',
    toUnitHeader: 'in',
    fromUnitInline: 'cm',
    toUnitInline: '"',
    sanitizeKeyboardInput: (strInput: string) => {
      return strInput
        .trim()
        .replaceAll(/[^\d\.]/g, '')
        .slice(0, 4);
    },
    parseInput: (cmString: string) => parseToDecimal(cmString),
    handleNewInput: (cmString: string) => {
      if (
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
      fromValue: number,
      conversionOptions: InputState[ConversionType.fromCm]['conversionOptions']
    ) => {
      return decimalToFractionStr(
        fromValue / INCH_TO_CM_RATIO,
        conversionOptions
      );
    },
    OptionsComponent: ({
      conversionOptions,
      dispatchInputState,
    }: {
      conversionOptions: InputState[ConversionType.fromCm]['conversionOptions'];
      dispatchInputState: ReturnType<
        typeof useInputState
      >['dispatchInputState'];
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
  },
  [ConversionType.fromInch]: {
    // TODO: implement
    reference: [],
    fromUnitHeader: 'in',
    toUnitHeader: 'cm',
    fromUnitInline: '"',
    toUnitInline: 'cm',
    convert: () => {
      return 1;
    },
    OptionsComponent: () => null,
  },
};

const tableCell = css`
  width: 11ch;
  padding: 0.5ch;
`;

const InputTable = ({
  conversionType,
  convert,
  fromValues,
}: {
  conversionType: ConversionType;
  convert: (fromValue: number) => string;
  fromValues: Array<number>;
}) => {
  const { fromUnitHeader, toUnitHeader, fromUnitInline, toUnitInline } =
    ConversionImplemention[conversionType];
  return (
    <div className="px-4 flex justify-center">
      <table className="font-mono table-fixed">
        <thead>
          <tr>
            <th>{fromUnitHeader}</th>
            <th>{toUnitHeader}</th>
          </tr>
        </thead>
        <tbody>
          {fromValues.map((from, index: number) => (
            <tr key={index} className="even:bg-gray-800">
              <td css={tableCell}>
                {from} {fromUnitInline}
              </td>
              <td css={tableCell}>
                {convert(from)}
                {toUnitInline}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MetricApp = () => {
  useAppHeight();

  const textInput = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    textInput.current?.focus();
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Prevents clobbering keyboard shortcuts like cmd+c or hitting Tab
      if (e.key.match(/(\d\.)/)) {
        textInput.current?.focus();
      }
      // TODO: potentially have it update state even for mobile
      // could be handy in weird cases of ipad-with-keyboard or windows hybrids
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const [currentInput, setCurrentInput] = React.useState<string>('');

  const { inputState, dispatchInputState } = useInputState();
  const { activeConversion, shouldShowEmptyInput } = inputState;
  if (activeConversion === ConversionType.fromInch) {
    throw new Error('Not yet implemented');
  }
  const conversionHistory = inputState[inputState.activeConversion].history;
  const conversionOptions = inputState[activeConversion].conversionOptions;

  const createEntry = React.useCallback(
    (newValue: number) => {
      dispatchInputState({ type: 'add', payload: newValue });
      setCurrentInput('');
    },
    [dispatchInputState]
  );
  const debouncedCreateEntry = React.useMemo(
    () => debounce(createEntry, 1500),
    [createEntry]
  );
  const onCurrentInputChange = React.useCallback(
    (inputStr: string) => {
      const handle =
        ConversionImplemention[activeConversion].handleNewInput(inputStr);
      if (handle === 'prevent') {
        return;
      }
      const parsedInput =
        ConversionImplemention[activeConversion].parseInput(inputStr);
      setCurrentInput(inputStr);
      debouncedCreateEntry(parsedInput);
      if (handle === 'flush') {
        debouncedCreateEntry.flush();
      }
    },
    [debouncedCreateEntry, activeConversion]
  );

  const isTouchDevice = useIsTouchDevice();

  const latestInput =
    currentInput ||
    (shouldShowEmptyInput ? null : conversionHistory[0]?.toString());

  const firstLoadBlankDisplay = (
    <span className="underline whitespace-pre">{'   '}</span>
  );
  const OptionsComponent =
    ConversionImplemention[activeConversion].OptionsComponent;

  const resultsDisplay = (
    <div className="flex font-mono py-4 text-xl">
      <p
        className="px-4"
        onClick={() => {
          setCurrentInput('');
          debouncedCreateEntry.flush();
          // TODO: actually toggle
        }}
      >
        🔀
      </p>
      <p className="flex-1 w-24">
        <span
          css={
            currentInput === '' &&
            css`
              background-color: hsl(336, 69%, 20.4%);
            `
          }
          className="text-pink-300 inline-block text-right px-px"
        >
          {latestInput || firstLoadBlankDisplay}
        </span>
        cm
      </p>
      <p className="flex-1">
        <span className="text-blue-300 px-px">
          {!latestInput
            ? firstLoadBlankDisplay
            : ConversionImplemention[activeConversion].convert(
                ConversionImplemention[activeConversion].parseInput(
                  latestInput
                ),
                conversionOptions
              )}
        </span>
        in
      </p>
      <OptionsComponent
        conversionOptions={conversionOptions}
        dispatchInputState={dispatchInputState}
      />
    </div>
  );

  return (
    <div>
      <div
        className="flex flex-col"
        css={css`
          height: 100vh;
          height: var(--app-height);
          overflow-y: auto;
        `}
      >
        <div
          className="overflow-y-scroll"
          css={css`
            @media (pointer: coarse) {
              height: 45%;
            }
          `}
        >
          <div
            className="px-4"
            css={css`
              @media (min-width: 768px) {
                min-height: 30vh;
              }
            `}
          >
            <div className="mb-8">
              <div className="flex place-content-between">
                <div>
                  <Link href="/">
                    <a className="text-blue-400 font-mono">sewing.clothing</a>
                  </Link>
                </div>
                <div>
                  <Link href="/tools">
                    <a className="text-blue-400 font-mono">/tools</a>
                  </Link>
                </div>
              </div>
              <h1 className="text-2xl text-center">Length converter</h1>
            </div>
          </div>
          <div
            css={css`
              @media (pointer: coarse) {
                display: none;
              }
            `}
          >
            <form autoComplete="off">
              <div>
                <input
                  className="px-2 border-4 border-purple-100 border-solid text-lg container bg-transparent"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  autoFocus={true}
                  ref={textInput}
                  onChange={(e) => {
                    onCurrentInputChange(
                      ConversionImplemention[
                        activeConversion
                      ].sanitizeKeyboardInput(e.target.value)
                    );
                  }}
                  value={currentInput === 'NaN' ? '' : currentInput}
                />
              </div>
            </form>
            {resultsDisplay}
          </div>
          <div className="flex flex-wrap">
            {conversionHistory.length > 0 && (
              <div className="p-2 w-full sm:w-1/2">
                <h3 className="hidden sm:block text-2xl sm:text-center">
                  History
                </h3>
                <InputTable
                  fromValues={conversionHistory}
                  conversionType={activeConversion}
                  convert={(from: number) =>
                    ConversionImplemention[activeConversion].convert(
                      from,
                      conversionOptions
                    )
                  }
                />
              </div>
            )}
            <div className="p-2 w-full mt-12 sm:mt-0 sm:w-1/2" key="reference">
              <h3 className="text-2xl sm:text-center">Reference</h3>
              <InputTable
                fromValues={ConversionImplemention[activeConversion].reference}
                conversionType={activeConversion}
                convert={(from: number) =>
                  ConversionImplemention[activeConversion].convert(
                    from,
                    conversionOptions
                  )
                }
              />
            </div>
          </div>
        </div>
        {isTouchDevice && (
          <div
            className="shrink-0 bg-black flex flex-col touch-none"
            css={css`
              height: 55%;
              padding-bottom: env(safe-area-inset-bottom, 50px);

              z-index: 1; /* must be set for shadow to display */
              box-shadow: 0px -5px 15px -5px black;
            `}
          >
            <div className="bg-stone-900 border-t border-stone-700">
              {resultsDisplay}
            </div>
            <div className="h-full select-none py-4 px-3">
              <div className="grid grid-cols-3 grid-rows-4 h-full gap-2">
                {MOBILE_KEYS[activeConversion].map((key: string) => (
                  <MobileKey
                    key={key}
                    value={key}
                    onClick={(newKey: string) => {
                      onCurrentInputChange(`${currentInput}${newKey}`);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricApp;
