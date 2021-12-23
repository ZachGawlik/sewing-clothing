import * as React from 'react';
import cx from 'classnames';
import { css } from '@emotion/react';
import Link from 'next/link';
import { useAppHeight } from 'utils/hooks';
import debounce from 'lodash/debounce';

enum ConversionType {
  fromInch = 'fromInch',
  fromCm = 'fromCm',
}

const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
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
 * Have 1/8s or 1/16s option
  Inch -> cm input.
 * Quick improvements for tablet
 * Uhhhhhh yards <-> meters?
*/

const parseToCm = (strInput: string) => {
  return strInput === '.'
    ? 0
    : parseFloat(parseFloat(strInput.trim()).toFixed(2));
};

export enum INCH_RESULT_FORMATS {
  SIXTEENTHS = 'SIXTEENTHS',
  EIGHTHS = 'EIGHTHS',
}

const cmToInchDecimal = (cmDecimal: number) => cmDecimal / 2.54;

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
  format: INCH_RESULT_FORMATS
) => {
  const { whole, numerator, denominator } = decimalToFraction(
    inchDecimal,
    format === INCH_RESULT_FORMATS.EIGHTHS ? 8 : 16
  );
  if (numerator === 0) {
    return `${whole}`;
  } else if (whole === 0) {
    return `${numerator}/${denominator}`;
  }
  return `${whole} ${numerator}/${denominator}`;
};

const CM_TABLE = [0.5, 1, 2, 3, 4, 5, 6, 10];

type InputHistoryActionType =
  | { type: 'add'; payload: number }
  | { type: 'load'; payload: Array<number> };

const initialInputHistoryState = {
  hasTypedThisSession: false,
  cmInputHistory: [],
};
const inputHistoryReducer = (
  state: {
    hasTypedThisSession: boolean;
    cmInputHistory: Array<number>;
  },
  action: InputHistoryActionType
) => {
  switch (action.type) {
    case 'load':
      return {
        hasTypedThisSession: false,
        cmInputHistory: action.payload,
      };
    case 'add':
      return {
        hasTypedThisSession: true,
        cmInputHistory: [action.payload, ...state.cmInputHistory].slice(0, 10),
      };
    default:
      throw new Error();
  }
};

const tableCell = css`
  width: 11ch;
  padding: 0.5ch;
`;

const InputTable = ({
  cmValues,
  inchResultFormat,
}: {
  cmValues: Array<number>;
  inchResultFormat: INCH_RESULT_FORMATS;
}) => (
  <div className="px-4 flex justify-center">
    <table className="font-mono table-fixed">
      <thead>
        <tr>
          <th>cm</th>
          <th>inch</th>
        </tr>
      </thead>
      <tbody>
        {cmValues.map((cmDecimal, index) => (
          <tr key={index} className="even:bg-gray-800">
            <td css={tableCell}>{cmDecimal} cm</td>
            <td css={tableCell}>
              {decimalToFractionStr(
                cmToInchDecimal(cmDecimal),
                inchResultFormat
              )}
              {'"'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MetricApp = () => {
  useAppHeight();

  const textInput = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    textInput.current?.focus();
  }, []);

  const [conversionType, setConversionType] = React.useState(
    ConversionType.fromCm
  );

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

  const [cmInput, setCmInput] = React.useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inchResultFormat, setInchResultFormat] =
    React.useState<INCH_RESULT_FORMATS>(INCH_RESULT_FORMATS.SIXTEENTHS);

  const [{ cmInputHistory, hasTypedThisSession }, dispatchCmInputHistory] =
    React.useReducer(inputHistoryReducer, initialInputHistoryState);
  React.useEffect(() => {
    // State could instead be initialized on client in first render,
    // but it leads to many SSR warnings, and suppressHydrationWarning
    // uses to counteract it. It's not worth it. It still looks instant.
    try {
      const storedHistory = window.localStorage.getItem('cmInputHistory');
      if (storedHistory) {
        dispatchCmInputHistory({
          type: 'load',
          payload: JSON.parse(storedHistory),
        });
      }
    } catch (e) {}
  }, []);
  React.useEffect(() => {
    window.localStorage.setItem(
      'cmInputHistory',
      JSON.stringify(cmInputHistory)
    );
  }, [cmInputHistory]);

  const createEntry = React.useCallback((newValue: number) => {
    dispatchCmInputHistory({ type: 'add', payload: newValue });
    setCmInput('');
  }, []);
  const debouncedCreateEntry = React.useMemo(
    () => debounce(createEntry, 1500),
    [createEntry]
  );
  const onCmInputChange = React.useCallback(
    (cmString: string) => {
      setCmInput(cmString);
      const parsedCm = parseToCm(cmString);
      if (cmString.length === 4 || parsedCm > 100) {
        debouncedCreateEntry.cancel();
        createEntry(parsedCm);
      } else {
        debouncedCreateEntry(parsedCm);
      }
    },
    [createEntry, debouncedCreateEntry]
  );

  const isTouchDevice = useIsTouchDevice();

  const latestInput =
    cmInput || (hasTypedThisSession ? cmInputHistory[0]?.toString() : null);

  const firstLoadBlankDisplay = (
    <span className="underline whitespace-pre">{'   '}</span>
  );
  const resultsDisplay = (
    <div className="flex font-mono py-4 text-xl">
      <p className="px-4">🔀</p>
      <p className="flex-1 w-24">
        <span
          css={
            cmInput === '' &&
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
            : decimalToFractionStr(
                cmToInchDecimal(parseToCm(latestInput)),
                inchResultFormat
              )}
        </span>
        in
      </p>
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
                    const sanitizedString = e.target.value
                      .trim()
                      .replaceAll(/[^\d\.]/g, '')
                      .slice(0, 4);
                    // TODO: implement restrictions like for mobile input
                    // where 4 chars is cool if it's 99.5 but not if 9999

                    onCmInputChange(sanitizedString);
                  }}
                  value={cmInput === 'NaN' ? '' : cmInput}
                />
              </div>
            </form>
            {resultsDisplay}
          </div>
          <div className="flex flex-wrap">
            {cmInputHistory.length > 0 && (
              <div className="p-2 w-full sm:w-1/2">
                <h3 className="hidden sm:block text-2xl sm:text-center">
                  History
                </h3>
                <InputTable
                  cmValues={cmInputHistory}
                  inchResultFormat={inchResultFormat}
                />
              </div>
            )}
            <div className="p-2 w-full mt-12 sm:mt-0 sm:w-1/2" key="reference">
              <h3 className="text-2xl sm:text-center">Reference</h3>
              <InputTable
                cmValues={CM_TABLE}
                inchResultFormat={inchResultFormat}
              />
            </div>
          </div>
        </div>
        <div
          className="shrink-0 bg-black flex flex-col touch-none"
          css={css`
            @media (pointer: fine) {
              display: none;
            }

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
              {MOBILE_KEYS[conversionType].map((key: string) => (
                <MobileKey
                  key={key}
                  value={key}
                  onClick={(newKey: string) => {
                    if (newKey === '.' && cmInput[cmInput.length - 1] === '.') {
                      return;
                    }
                    if (
                      cmInput.length < 4 &&
                      (cmInput === '.' || +cmInput < 100)
                    ) {
                      const newCmInput = `${cmInput}${newKey}`;
                      onCmInputChange(newCmInput);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricApp;
