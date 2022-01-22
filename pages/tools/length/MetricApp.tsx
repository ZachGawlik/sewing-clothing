import * as React from 'react';
import cx from 'classnames';
import { css, keyframes } from '@emotion/react';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import immer from 'immer';
import { useAppHeight } from 'utils/hooks';
import {
  ConversionType,
  HEADER_TO_COLOR,
  IMPLEMENTATIONS,
  INCH_RESULT_FORMATS,
} from './constants';

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

const maxMobileKeyboardHeight = '350px';
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

/*
TODOS:
 * Inch -> cm input.
 * Quick improvements for tablet
 * Uhhhhhh yards <-> meters?
 * Use locale to determine "." vs "," separator
*/

const initialInputState = {
  shouldShowEmptyInput: true,
  conversionType: ConversionType.fromCm,
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

export type InputState = {
  shouldShowEmptyInput: boolean;
  conversionType: ConversionType;

  [ConversionType.fromCm]: {
    history: Array<string>;
    conversionOptions: {
      precision: INCH_RESULT_FORMATS;
    };
  };
  [ConversionType.fromInch]: {
    history: Array<string>;
    conversionOptions: Record<string, never>;
  };
};

type InputActionType =
  | { type: 'add'; payload: string }
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
        draft[draft.conversionType].history.unshift(action.payload);
        draft[draft.conversionType].history.splice(10);
      });
    case 'toggleUnits':
      return immer(state, (draft) => {
        draft.shouldShowEmptyInput = true;
        draft.conversionType =
          draft.conversionType === ConversionType.fromCm
            ? ConversionType.fromInch
            : ConversionType.fromCm;
      });
    case 'toggleInchPrecision':
      if (state.conversionType !== ConversionType.fromCm) {
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
export type DispatchInputState = ReturnType<
  typeof useInputState
>['dispatchInputState'];

const tableCell = css`
  width: 11ch;
  padding: 0.5ch;
`;

const MOBILE_KEY_MAX_WIDTH = '450px';

const InputTable = ({
  convert,
  conversionType,
  fromValues,
}: {
  conversionType: ConversionType;
  convert: (fromValue: string) => string;
  fromValues: Array<string>;
}) => {
  const { fromUnitHeader, toUnitHeader, fromUnitInline, toUnitInline } =
    IMPLEMENTATIONS[conversionType];

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
          {fromValues.map((from: string, index: number) => (
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

const blink = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

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
  const { conversionType, shouldShowEmptyInput } = inputState;
  const conversionHistory = inputState[inputState.conversionType].history;

  const createEntry = React.useCallback(
    (newValue: string) => {
      dispatchInputState({ type: 'add', payload: newValue });
      setCurrentInput('');
    },
    [dispatchInputState]
  );
  const debouncedCreateEntry = React.useMemo(
    () => debounce(createEntry, 1500),
    [createEntry]
  );
  const conversionImplementation = IMPLEMENTATIONS[conversionType];
  const { fromUnitHeader, toUnitHeader, mobileKeys } = conversionImplementation;

  const convert = (fromValue: string) => {
    // This looks redundant but is needed for TypeScript.
    // Without the switch, function arg contravariance causes typescript to take options as an intersection type
    // Explicitly breaking out the switch cases lets Typescript grab the specific options type for each case
    switch (conversionType) {
      case 'fromInch':
        return IMPLEMENTATIONS[conversionType].convert(
          fromValue,
          inputState[conversionType].conversionOptions
        );
      case 'fromCm':
        return IMPLEMENTATIONS[conversionType].convert(
          fromValue,
          inputState[conversionType].conversionOptions
        );
      default:
        throw new Error('Convert passed unknown conversion type');
    }
  };

  const optionsComponent = (() => {
    switch (conversionType) {
      case 'fromInch': {
        const { OptionsComponent } = IMPLEMENTATIONS[conversionType];
        return <OptionsComponent />;
      }
      case 'fromCm': {
        const { OptionsComponent } = IMPLEMENTATIONS[conversionType];
        return (
          <OptionsComponent
            conversionOptions={inputState[conversionType].conversionOptions}
            dispatchInputState={dispatchInputState}
          />
        );
      }
      default:
        throw new Error('Convert passed unknown conversion type');
    }
  })();

  const onCurrentInputChange = React.useCallback(
    (inputStr: string) => {
      const handle = conversionImplementation.handleNewInput(inputStr);
      if (handle === 'prevent') {
        return;
      }
      const parsedInput = conversionImplementation.parseInput(inputStr);
      setCurrentInput(inputStr);
      debouncedCreateEntry(parsedInput);
      if (handle === 'flush') {
        debouncedCreateEntry.flush();
      }
    },
    [debouncedCreateEntry, conversionImplementation]
  );

  const isTouchDevice = useIsTouchDevice();

  const latestInput =
    currentInput ||
    (shouldShowEmptyInput ? null : conversionHistory[0]?.toString());

  const firstLoadBlankDisplay = (
    <span className="underline whitespace-pre">{'   '}</span>
  );

  const resultsDisplay = (
    <div
      className="font-mono text-xl items-center"
      css={css`
        display: grid;
        grid-template-columns: 50px auto 50px;
        @media (min-width: 640px) {
          grid-template-columns: 1fr ${MOBILE_KEY_MAX_WIDTH} 1fr;
        } ;
      `}
    >
      <p
        className="p-4"
        onClick={() => {
          setCurrentInput('');
          debouncedCreateEntry.flush();
          dispatchInputState({ type: 'toggleUnits' });
        }}
      >
        🔀
      </p>
      <div className="flex">
        <div className="flex-1 w-24 sm:w-1/2">
          <span
            css={css`
              background-color: ${currentInput === ''
                ? 'hsla(255, 0%, 100%, 0.2)'
                : ''};
              color: ${HEADER_TO_COLOR[fromUnitHeader]};
            `}
            className={`inline-block text-right px-px whitespace-pre`}
          >
            {latestInput || firstLoadBlankDisplay}
          </span>
          {/* Safari bugs out animating opacity for inline elements */}
          {currentInput && (
            <span
              className="h-full w-px inline-block align-bottom"
              key={latestInput /* effectively debounces animation */}
              css={css`
                background-color: ${HEADER_TO_COLOR[fromUnitHeader]};
                filter: hue-rotate(45deg);
                animation: ${blink} ease-in-out 0.6s infinite;
                animation-direction: alternate;
                animation-delay: 0.3s;
              `}
            />
          )}
          {fromUnitHeader}
        </div>
        <p className="flex-1 sm:w-1/2 text-right">
          <span
            className="px-px"
            css={css`
              color: ${HEADER_TO_COLOR[toUnitHeader]};
            `}
          >
            {!latestInput
              ? firstLoadBlankDisplay
              : convert(conversionImplementation.parseInput(latestInput))}
          </span>
          {toUnitHeader}
        </p>
      </div>
      <div className="flex justify-end">
        <div>{optionsComponent}</div>
      </div>
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
              height: max(
                50%,
                calc(var(--app-height) - ${maxMobileKeyboardHeight})
              );
            }
          `}
        >
          <div className="px-4">
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
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
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
                      conversionImplementation.sanitizeKeyboardInput(
                        e.target.value
                      )
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
                  conversionType={conversionType}
                  convert={convert}
                />
              </div>
            )}
            <div className="p-2 w-full mt-12 sm:mt-0 sm:w-1/2" key="reference">
              <h3 className="text-2xl sm:text-center">Reference</h3>
              <InputTable
                fromValues={conversionImplementation.reference}
                conversionType={conversionType}
                convert={convert}
              />
            </div>
          </div>
        </div>
        {isTouchDevice && (
          <div
            className="shrink-0 bg-black flex flex-col touch-none"
            css={css`
              height: 50%;
              max-height: ${maxMobileKeyboardHeight};
              padding-bottom: env(safe-area-inset-bottom, 50px);

              z-index: 1; /* must be set for shadow to display */
              box-shadow: 0px -5px 15px -5px black;
            `}
          >
            <div className="bg-stone-900 border-t border-stone-700">
              {resultsDisplay}
            </div>
            <div className="h-full select-none py-4 px-3">
              <div className="flex justify-center align-center h-full">
                <div
                  className="grid grid-cols-3 grid-rows-4 h-full w-full gap-2"
                  css={css`
                    max-width: ${MOBILE_KEY_MAX_WIDTH};
                  `}
                >
                  {mobileKeys.map((key: string) => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricApp;
