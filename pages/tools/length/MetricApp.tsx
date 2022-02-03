import * as React from 'react';
import cx from 'classnames';
import { Global, css, keyframes } from '@emotion/react';
import debounce from 'lodash/debounce';
import immer from 'immer';
import {
  ConversionType,
  INLINE_UNIT_TO_COLOR,
  IMPLEMENTATIONS,
  INCH_RESULT_FORMATS,
} from './constants';
import PageHeader from 'pages/components/PageHeader';

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
  className,
  onClick,
  value,
}: {
  className?: string;
  onClick: (key: string) => void;
  value: string;
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
        className,
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

const MOBILE_KEY_MAX_WIDTH = '450px';

const InputTable = ({
  className,
  convert,
  conversionType,
  fromValues,
}: {
  className?: string;
  conversionType: ConversionType;
  convert: (fromValue: string) => string;
  fromValues: Array<string>;
}) => {
  const { fromUnitHeader, toUnitHeader, fromUnitInline, toUnitInline } =
    IMPLEMENTATIONS[conversionType];

  const tableCell = css`
    width: 11ch;
    padding: 0.5ch;
  `;

  return (
    <div className={cx(className, 'flex')}>
      <table className="font-mono table-fixed">
        <thead>
          <tr>
            <th css={tableCell}>{fromUnitHeader}</th>
            <th css={tableCell}>{toUnitHeader}</th>
          </tr>
        </thead>
        <tbody>
          {fromValues.map((from: string, index: number) => (
            <tr key={index} className="even:bg-gray-800">
              <td css={tableCell}>
                {from}
                {fromUnitInline}
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
  const textInput = React.useRef<HTMLInputElement>(null);
  const [currentInput, setCurrentInput] = React.useState<string>('');
  React.useEffect(() => {
    textInput.current?.focus();
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.match(/[\d\.\/ ]/)) {
        setCurrentInput('');
        textInput.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const { inputState, dispatchInputState } = useInputState();
  const { conversionType, shouldShowEmptyInput } = inputState;
  const conversionHistory = inputState[inputState.conversionType].history;

  const isTouchDevice = useIsTouchDevice();

  const createEntry = React.useCallback(
    (newValue: string) => {
      dispatchInputState({ type: 'add', payload: newValue });
      if (isTouchDevice) {
        setCurrentInput('');
      }
      textInput.current?.select();
    },
    [dispatchInputState, isTouchDevice]
  );
  const debouncedCreateEntry = React.useMemo(
    () => debounce(createEntry, 1500),
    [createEntry]
  );
  const conversionImplementation = IMPLEMENTATIONS[conversionType];
  const { fromUnitInline, toUnitInline, mobileKeys } = conversionImplementation;

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
        return null;
      }
      case 'fromCm': {
        const { OptionsComponent } = IMPLEMENTATIONS[conversionType];
        return (
          <OptionsComponent
            conversionOptions={inputState[conversionType].conversionOptions}
            dispatchInputState={dispatchInputState}
            onClick={() => {
              textInput.current?.focus();
            }}
          />
        );
      }
      default:
        throw new Error('Convert passed unknown conversion type');
    }
  })();

  const onCurrentInputChange = React.useCallback(
    (inputStr: string) => {
      if (inputStr === '') {
        // only possible when backspacing on desktop input
        debouncedCreateEntry.cancel();
        setCurrentInput(inputStr);
        return;
      }
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

  // latestInput concept only exists for mobile. Otherwise input doesn't get cleared for desktop
  const latestInput =
    currentInput ||
    (shouldShowEmptyInput ? null : conversionHistory[0]?.toString());

  const firstLoadBlankDisplay = (
    <span className="underline whitespace-pre">{'   '}</span>
  );

  const [isInputBlurred, setIsInputBlurred] = React.useState(false);

  // inline-block is necessary for animating opacity for iOS Safari
  const mobileCursor = (
    <span
      className="h-full w-[2px] inline-block align-bottom"
      key={latestInput /* effectively debounces animation */}
      css={css`
        background-color: hsla(0, 0%, 40%);
        animation: ${blink} ease-in-out 0.8s infinite;
        animation-direction: alternate;
        animation-delay: 0.3s;
      `}
    />
  );

  const resultsDisplay = (
    <div
      css={css`
        @media (min-width: 768px) and (pointer: fine) {
          margin: 0 auto;
          width: 620px;
        }
      `}
    >
      <div
        className="font-mono text-xl items-center"
        css={css`
          display: grid;
          grid-template-columns: 50px auto 50px;
          @media (min-width: 640px) and (pointer: coarse) {
            grid-template-columns: 1fr ${MOBILE_KEY_MAX_WIDTH} 1fr;
          }
          @media (min-width: 768px) and (pointer: fine) {
            grid-template-columns: 50px 520px 50px;
          }
        `}
      >
        <div>
          <button
            type="button"
            aria-label="Flip conversion direction"
            className="p-4 select-none"
            onClick={() => {
              setCurrentInput('');
              debouncedCreateEntry.flush();
              dispatchInputState({ type: 'toggleUnits' });
              textInput.current?.focus();
            }}
          >
            🔀
          </button>
        </div>
        <div className="flex">
          <div className="flex-1 w-24 sm:w-1/2 whitespace-nowrap">
            {!isTouchDevice ? (
              <form
                autoComplete="off"
                onSubmit={(e) => {
                  debouncedCreateEntry.flush();
                  e.preventDefault();
                }}
              >
                <div
                  css={css`
                    ::selection {
                      background-color: hsla(0, 0%, 100%, 0.3);
                    }
                  `}
                >
                  <input
                    className="appearance-none px-2 text-lg sm:text-2xl text-mono container bg-transparent shadow-none ring-0 border-0 outline-none"
                    css={css`
                      width: ${(currentInput || '').length || 1}ch;
                      padding: 0;
                      color: ${INLINE_UNIT_TO_COLOR[fromUnitInline].text};
                      caret-color: ${INLINE_UNIT_TO_COLOR[fromUnitInline].text};
                      ::selection {
                        background-color: hsl(0, 0%, 30%);
                      }
                      background-color: ${isInputBlurred
                        ? 'hsl(0, 0%, 30%)'
                        : 'transparent'};
                    `}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    autoFocus={true}
                    ref={textInput}
                    onFocus={() => {
                      setIsInputBlurred(false);
                    }}
                    onBlur={() => {
                      setIsInputBlurred(true);
                    }}
                    onKeyDown={(e) => {
                      // Wipe past entry if user typed digit after deselecting flushed input
                      if (
                        e.key.match(/\d/) &&
                        conversionImplementation.handleNewInput(
                          currentInput || ''
                        ) === 'flush'
                      ) {
                        setCurrentInput('');
                      }
                      e.stopPropagation();
                    }}
                    onChange={(e) => {
                      const sanitizedInput =
                        conversionImplementation.sanitizeKeyboardInput(
                          e.target.value
                        );
                      if (sanitizedInput !== currentInput) {
                        onCurrentInputChange(sanitizedInput);
                      }
                    }}
                    placeholder={shouldShowEmptyInput ? '_' : undefined}
                    value={currentInput || ''}
                  />
                  {fromUnitInline}
                </div>
              </form>
            ) : (
              <>
                <span className={cx('mr-px', { 'opacity-0': currentInput })}>
                  {mobileCursor}
                </span>
                <span
                  css={css`
                    background-color: ${currentInput === ''
                      ? 'hsla(255, 0%, 100%, 0.2)'
                      : ''};
                    color: ${INLINE_UNIT_TO_COLOR[fromUnitInline].text};
                  `}
                  className={`inline-block text-right px-px whitespace-pre`}
                >
                  {latestInput || firstLoadBlankDisplay}
                </span>
                {currentInput && mobileCursor}
                {fromUnitInline}
              </>
            )}
          </div>
          <p className="flex-1 sm:w-1/2 whitespace-nowrap text-right text-lg sm:text-2xl">
            <span
              className="px-px"
              css={css`
                color: ${INLINE_UNIT_TO_COLOR[toUnitInline].text};
              `}
            >
              {!latestInput
                ? firstLoadBlankDisplay
                : convert(conversionImplementation.parseInput(latestInput))}
            </span>
            <span className="w-[2ch] inline-block text-left">
              {toUnitInline}
            </span>
          </p>
        </div>
        <div className="flex justify-end">
          <div>{optionsComponent}</div>
        </div>
      </div>
    </div>
  );

  const isEmptyHistoryMobile = isTouchDevice && conversionHistory.length === 0;
  return (
    <div className="h-full">
      <Global
        styles={css`
          html,
          body {
            height: 100%;
          }
        `}
      />
      <div
        className="flex flex-col"
        css={css`
          height: 100%;
          overflow-y: auto;
        `}
      >
        <div
          className="overflow-y-scroll"
          css={css`
            @media (pointer: coarse) {
              height: 50%;
            }
          `}
        >
          <PageHeader className="px-4 md:mb-8">
            <h1 className="text-2xl text-center">Length converter</h1>
          </PageHeader>
          {!isTouchDevice && resultsDisplay}
          <main className="flex flex-wrap md:max-w-[520px] md:mx-auto md:justify-between">
            {!isEmptyHistoryMobile && (
              <div className="p-2 w-full sm:w-1/2 md:w-auto">
                <h3 className="hidden sm:block text-2xl text-center md:text-left">
                  History
                </h3>
                <InputTable
                  className="justify-center md:justify-start"
                  fromValues={conversionHistory}
                  conversionType={conversionType}
                  convert={convert}
                />
              </div>
            )}
            <div
              className={cx('p-2 w-full sm:mt-0 sm:w-1/2 md:w-auto', {
                'mt-12': !isEmptyHistoryMobile,
              })}
              key="reference"
            >
              {!isEmptyHistoryMobile && (
                <h3 className="text-2xl sm:text-left">Reference</h3>
              )}
              <InputTable
                className="justify-center md:justify-start"
                fromValues={conversionImplementation.reference}
                conversionType={conversionType}
                convert={convert}
              />
            </div>
          </main>
        </div>
        {isTouchDevice && (
          <div
            className="shrink-0 bg-black flex flex-col touch-none"
            css={css`
              height: 50%;
              max-height: ${maxMobileKeyboardHeight};
              padding-bottom: env(safe-area-inset-bottom, 50px);
              background-color: ${INLINE_UNIT_TO_COLOR[fromUnitInline]
                .mobileKeyBg};

              z-index: 1; /* must be set for shadow to display */
              box-shadow: 0px -5px 15px -5px black;
            `}
          >
            <div
              className={`border-t`}
              css={css`
                border-color: ${INLINE_UNIT_TO_COLOR[fromUnitInline]
                  .mobileKeyBorder};
              `}
            >
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
                      css={css`
                        color: ${INLINE_UNIT_TO_COLOR[fromUnitInline].text};
                      `}
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
