// import { css } from '@emotion/react';
import * as React from 'react';
import Link from 'next/link';
import { debounce } from 'utils';

function reduceFraction(numerator: number, denominator: number) {
  function getGcd(a: number, b: number): number {
    return b ? getGcd(b, a % b) : a;
  }
  const gcd = getGcd(numerator, denominator);
  return [numerator / gcd, denominator / gcd];
}

/*
TODOS:
 * Enable decimal
 * Support cm input like "1.5"cm
 * Have 5/8s or 1/16s option
 * Commit history to localstorage
  Inch -> cm input.
 * TODO: I should remove inputMode when inputting imperial
 * Mobile. How to deal with keyboard
 * Design. For all sizes.
 * ? Table as second "page" with input page as 100vh?
 * 		Or only displaying together for large-enough resolutions.. if I figure out design that isn't clunky
 * Query params
 * Uhhhhhh yards <-> meters?
*/

const parseToCm = (strInput: string) => {
  // TODO: strip a-z, etc.
  return parseFloat(parseFloat(strInput.trim()).toFixed(2));
};

enum INCH_RESULT_FORMATS {
  SIXTEENTHS = 'SIXTEENTHS',
  EIGHTHS = 'EIGHTHS',
}

const cmToInchDecimal = (cmDecimal: number) => cmDecimal / 2.54;
const inchDecimalToHuman = (
  inchDecimal: number,
  format: INCH_RESULT_FORMATS
) => {
  const sixteenths = Math.round(inchDecimal / (1 / 16));
  const [numerator, denominator] = reduceFraction(sixteenths, 16);
  const whole = Math.floor(numerator / denominator);
  if (format === INCH_RESULT_FORMATS.EIGHTHS && denominator === 16) {
    return 'todo implement eightssssssss';
    // return `${whole} ${numerator - whole * denominator}/${denominator}`;
  }
  return `${whole} ${numerator - whole * denominator}/${denominator}`;
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
  <table className="font-mono table-fixed container mx-4">
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
            {inchDecimalToHuman(cmToInchDecimal(cmDecimal), inchResultFormat)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const MetricApp = () => {
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
        console.log(newValue);
        dispatchCmInputHistory({ type: 'add', payload: newValue });
        setCmInput('');
      }, 2000),
    []
  );

  const latestInput = cmInput || cmInputHistory[0]?.toString();

  return (
    <div>
      <div
        className="px-4"
        css={{
          minHeight: '90vh',
        }}
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
            {/* text-lg is necessary to prevent ios zooming on focus */}
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
              {latestInput !== 'NaN' &&
                inchDecimalToHuman(
                  cmToInchDecimal(parseFloat(latestInput)),
                  inchResultFormat
                )}
            </span>
            in
          </p>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl">History</h3>
          <InputTable
            cmValues={!cmInput ? cmInputHistory.slice(1) : cmInputHistory}
            inchResultFormat={inchResultFormat}
          />
        </div>
      </div>
      <div className="bg-gray-800">
        <div className="px-4">
          <h3 className="text-2xl">Reference</h3>
          <InputTable cmValues={CM_TABLE} inchResultFormat={inchResultFormat} />
        </div>
      </div>
    </div>
  );
};

export default MetricApp;
