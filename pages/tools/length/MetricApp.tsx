import * as React from 'react';
import cx from 'classnames';
import { css } from '@emotion/react';
import Link from 'next/link';
import { debounce } from 'utils';
import { useAppHeight } from 'utils/hooks';

enum ConversionType {
  fromInch = 'fromInch',
  fromCm = 'fromCm',
}

/* Mobile keyboard area */
const MobileKeySet = {
  [ConversionType.fromInch]: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'space',
    '0',
    '/',
  ],
  [ConversionType.fromCm]: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '.',
    '0',
  ],
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
 * 61cm is reporting 24 0/1in . shouldnt show fraction
 * Have 1/8s or 1/16s option
 * Commit history to localstorage
  Inch -> cm input.
 * Design. For all sizes.
 * ? Table as second "page" with input page as 100vh?
 * 		Or only displaying together for large-enough resolutions.. if I figure out design that isn't clunky
 * Query params
 * Uhhhhhh yards <-> meters?
*/

const parseToCm = (strInput: string) => {
  return parseFloat(parseFloat(strInput.trim()).toFixed(2));
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
  | { type: 'clear'; payload: undefined };

const inputHistoryReducer = (
  state: Array<number>,
  action: InputHistoryActionType
) => {
  switch (action.type) {
    case 'add':
      return [action.payload, ...state].slice(0, 10);
    case 'clear':
      return [];
    default:
      throw new Error();
  }
};

const InputTable = ({
  cmValues,
  inchResultFormat,
}: {
  cmValues: Array<number>;
  inchResultFormat: INCH_RESULT_FORMATS;
}) => (
  <div className="px-4">
    <table className="font-mono table-fixed w-full">
      <thead>
        <tr>
          <th>cm</th>
          <th>inches</th>
        </tr>
      </thead>
      <tbody>
        {cmValues.map((cmDecimal, index) => (
          <tr key={index}>
            <td className="w-1/2">{cmDecimal}cm</td>
            <td className="w-1/2">
              {decimalToFractionStr(
                cmToInchDecimal(cmDecimal),
                inchResultFormat
              )}
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

  const [cmInputHistory, dispatchCmInputHistory] = React.useReducer(
    inputHistoryReducer,
    []
  );

  const debouncedCreateEntry = React.useMemo(
    () =>
      debounce((newValue: number) => {
        dispatchCmInputHistory({ type: 'add', payload: newValue });
        setCmInput('');
      }, 1500),
    []
  );

  const latestInput = cmInput || cmInputHistory[0]?.toString();

  return (
    <div
      className="flex flex-col"
      css={css`
        height: 100vh;
        height: var(--app-height);
      `}
    >
      <div
        className="overflow-y-scroll"
        css={css`
          height: 67%;
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
          <div className="mb-8 px-12">
            <div className="border-dashed">
              <Link href="/">
                <a>sewing.clothing</a>
              </Link>
              <Link href="/tools">
                <a>/tools</a>
              </Link>
              /length
            </div>
            <h1 className="font-mono text-2xl">Length converter</h1>
          </div>
          <form autoComplete="off">
            <div>
              <input
                css={css`
                  @media (pointer: coarse) {
                    display: none;
                  }
                `}
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
                  setCmInput(sanitizedString);
                  debouncedCreateEntry(parseToCm(sanitizedString));
                }}
                value={cmInput === 'NaN' ? '' : cmInput}
              />
            </div>
          </form>
          <div className="flex font-mono mb-8">
            <p className="flex-1">
              <span className="text-xl text-pink-300 inline-block w-24 text-right">
                {latestInput}
              </span>
              cm
            </p>
            <p className="flex-1">
              <span className="text-xl text-blue-300">
                {!latestInput
                  ? ''
                  : decimalToFractionStr(
                      cmToInchDecimal(parseFloat(latestInput)),
                      inchResultFormat
                    )}
              </span>
              in
            </p>
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="p-2 w-full sm:w-1/2">
            <h3 className="text-2xl">History</h3>
            <InputTable
              cmValues={!cmInput ? cmInputHistory.slice(1) : cmInputHistory}
              inchResultFormat={inchResultFormat}
            />
          </div>
          <div className="bg-gray-800 p-2 w-full sm:w-1/2">
            <h3 className="text-2xl">Reference</h3>
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
          height: 33%;
          padding-bottom: env(safe-area-inset-bottom, 50px);

          z-index: 1; /* must be set for shadow to display */
          box-shadow: 0px -5px 15px -5px black;
          @media (pointer: fine) {
            display: none;
          }
        `}
      >
        <div className="">{`CM -> Inch`}.</div>
        <div className="h-full select-none pb-4 px-3">
          <div className="grid grid-cols-3 grid-rows-4 h-full gap-4">
            {MobileKeySet[conversionType].map((key: string) => (
              <MobileKey
                key={key}
                value={key}
                onClick={(newKey: string) => {
                  const newCmInput = `${cmInput}${newKey}`;
                  setCmInput(newCmInput);
                  debouncedCreateEntry(parseToCm(newCmInput));
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricApp;
