import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { useClickAway } from 'react-use';
import moment from 'moment';
import { DayPicker, MonthPicker, YearPicker } from './Pickers';

const viewModes = {
  YEARS: 'years',
  MONTHS: 'months',
  DAYS: 'days',
  TIME: 'time'
};
const nextView = { days: 'time', months: 'days', years: 'months' };

import './Date-picker.css';

function PickerContainer(props) {
  const {
    value,
    initialValue,
    initialPickerDate,
    className = '',
    input = true,
    open,
    updateOnView,
    defaultValue,
    initialPickerMode = 'days',
    dateFormat = true,
    timeConstraints = {},
    onOpen = () => {},
    onClose = () => {},
    onBeforeNavigate = (next) => next,
    onNavigate = () => {},
    onNavigateForward = () => {},
    onNavigateBack = () => {},
    onChange = () => {},
    utc = false,
    displayZone,
    displayTimeZone,
    locale,
    strictParsing = true,
    inputProps = {},
    renderInput,
    closeOnClickOutside = true,
    closeOnTab = true,
    closeOnSelect = true,
    renderView = () => {},
    isValidDate = () => true,
    renderYear,
    renderMonth,
    renderDay
  } = props;

  // get date format from option or default
  const getDateFormat = useCallback(() => {
    if (dateFormat === true) return 'YYYY-MM-DD';
    if (dateFormat) return dateFormat;
    return '';
  }, [dateFormat]);

  // set moment to certain timezone
  const localMoment = useCallback(
    (date, format) => {
      let m = null;

      if (utc) {
        m = moment.utc(date, format, strictParsing);
      } else if (displayTimeZone) {
        m = moment.tz(date, format, displayTimeZone);
      } else {
        m = moment(date, format, strictParsing);
      }

      if (locale) m.locale(locale);
      return m;
    },
    [utc, strictParsing, displayTimeZone, locale]
  );

  // get locale from moment
  const getLocaleData = useCallback(() => {
    return localMoment(value || defaultValue || new Date()).localeData();
  }, [value, defaultValue, localMoment]);

  // parse date in locale format
  const parseDate = useCallback(
    (date, dateFormat) => {
      let parsedDate;

      if (date && typeof date === 'string')
        parsedDate = localMoment(date, dateFormat);
      else if (date) parsedDate = localMoment(date);

      if (parsedDate && !parsedDate.isValid()) parsedDate = null;

      return parsedDate;
    },
    [localMoment]
  );

  // chose picker from dateFormat option value
  const getUpdateOn = useCallback(
    (dateFormat) => {
      if (updateOnView) {
        return updateOnView;
      }

      if (dateFormat.match(/[lLD]/)) {
        return viewModes.DAYS;
      }

      if (dateFormat.indexOf('M') !== -1) {
        return viewModes.MONTHS;
      }

      if (dateFormat.indexOf('Y') !== -1) {
        return viewModes.YEARS;
      }

      return viewModes.DAYS;
    },
    [updateOnView]
  );

  // set initail picker
  const getInitialView = useCallback(() => {
    const dateFormat = getDateFormat();
    return dateFormat ? getUpdateOn(dateFormat) : viewModes.TIME;
  }, [getDateFormat, getUpdateOn]);

  // get Initail date for picker
  const getinitialPickerDate = useCallback(
    (selectedDate) => {
      let viewDate;
      if (initialPickerDate) {
        viewDate = parseDate(initialPickerDate, getDateFormat());
        if (viewDate && viewDate.isValid()) {
          return viewDate;
        }
        log(
          `initialPickerDate: "${initialPickerDate}" is not valid. Set to current date instead.`
        );
      } else if (selectedDate && selectedDate.isValid()) {
        return selectedDate.clone();
      }
      return getInitialDate();
    },
    [initialPickerDate, getDateFormat, getInitialDate, parseDate]
  );

  // zeroing Date to day base
  const getInitialDate = useCallback(() => {
    const m = localMoment();
    m.hour(0).minute(0).second(0).millisecond(0);
    return m;
  }, [localMoment]);

  // get Initial InputValue from option
  const getInitialInputValue = useCallback(
    (selectedDate) => {
      if (inputProps?.value) return inputProps.value;

      if (selectedDate && selectedDate.isValid())
        return selectedDate.format(getDateFormat());

      if (value && typeof value === 'string') return value;

      if (initialValue && typeof initialValue === 'string') return initialValue;

      return '';
    },
    [inputProps, value, initialValue, getDateFormat]
  );

  // initailize component state
  const initialSelectedDate = useMemo(
    () => parseDate(value || initialValue, getDateFormat()),
    [getDateFormat, initialValue, parseDate, value]
  );

  const [openState, setOpenState] = useState(!input);
  const [currentViewState, setCurrentViewState] = useState(
    initialPickerMode || getInitialView()
  );
  const [viewDateState, setViewDateState] = useState(
    getinitialPickerDate(initialSelectedDate)
  );
  const [selectedDateState, setSelectedDateState] = useState(
    getinitialPickerDate(
      initialSelectedDate && initialSelectedDate.isValid()
        ? initialSelectedDate
        : undefined
    )
  );
  const [inputValueState, setInputValueState] = useState(
    getInitialInputValue(initialSelectedDate)
  );

  const isOpen = useMemo(
    () => (open === undefined ? openState : open),
    [open, openState]
  );

  // get className for picker container
  const getClassName = useCallback(() => {
    let cn = 'dp';
    const propCn = className;

    if (Array.isArray(propCn)) {
      cn += ` ${propCn.join(' ')}`;
    } else if (propCn) {
      cn += ` ${propCn}`;
    }

    if (!input) {
      cn += ' dp-Static';
    }

    if (isOpen) {
      cn += ' dp-Open';
    }

    return cn;
  }, [className, input, isOpen]);

  // show picker & trigger option callback
  const _showPicker = useCallback(
    (view, date) => {
      const d = (date || viewDateState).clone();
      const nextView = onBeforeNavigate(view, currentViewState, d);

      if (nextView && currentViewState !== nextView) {
        onNavigate(nextView);
        setCurrentViewState(nextView);
      }
    },
    [onBeforeNavigate, onNavigate, currentViewState, viewDateState]
  );

  // update state from picker event
  const _updateDate = useCallback(
    (e) => {
      const viewToMethod = { days: 'date', months: 'month', years: 'year' };
      const updateOnView = getUpdateOn(getDateFormat());
      const viewDate = viewDateState.clone();

      // Set the value into day/month/year
      viewDate[viewToMethod[currentViewState]](
        parseInt(e.target.getAttribute('data-value'), 10)
      );

      // Need to set month and year will for days view (prev/next month)
      if (currentViewState === 'days') {
        viewDate.month(parseInt(e.target.getAttribute('data-month'), 10));
        viewDate.year(parseInt(e.target.getAttribute('data-year'), 10));
      }

      setViewDateState(viewDate);

      if (currentViewState === updateOnView) {
        setSelectedDateState(viewDate.clone());
        setInputValueState(viewDate.format(getDateFormat()));

        if (open === undefined && input && closeOnSelect) {
          _closeCalendar();
        }

        onChange(viewDate.clone());
      } else {
        _showPicker(nextView[currentViewState], viewDate);
      }
    },
    [
      open,
      input,
      closeOnSelect,
      onChange,
      _closeCalendar,
      _showPicker,
      getDateFormat,
      getUpdateOn,
      currentViewState,
      viewDateState
    ]
  );

  // nav picker view
  const _pickerNavigate = useCallback(
    (modifier, unit) => {
      const viewDate = viewDateState.clone();

      viewDate.add(modifier, unit);

      if (modifier > 0) {
        onNavigateForward(modifier, unit);
      } else {
        onNavigateBack(-modifier, unit);
      }

      setViewDateState(viewDate);
    },
    [onNavigateForward, onNavigateBack, viewDateState]
  );

  // set open state & trigger option callback
  const _openCalendar = useCallback(() => {
    if (isOpen) return;
    setOpenState(true);
    onOpen();
  }, [isOpen, onOpen]);

  const _closeCalendar = useCallback(() => {
    if (!isOpen) return;
    setOpenState(false);
    onClose(selectedDateState || inputValueState);
  }, [isOpen, inputValueState, selectedDateState, onClose]);

  // trigger option ClickAway callback
  const _handleClickAway = useCallback(() => {
    if (input && openState && open === undefined && closeOnClickOutside) {
      _closeCalendar();
    }
  }, [input, open, closeOnClickOutside, _closeCalendar, openState]);

  // get selectedDate from option
  const getSelectedDate = useCallback(() => {
    if (value === undefined) return selectedDateState;
    const selectedDate = parseDate(value, getDateFormat());
    return selectedDate && selectedDate.isValid() ? selectedDate : false;
  }, [value, getDateFormat, parseDate, selectedDateState]);

  // get input from option or state
  const getInputValue = useCallback(() => {
    const selectedDate = getSelectedDate();
    return selectedDate
      ? selectedDate.format(getDateFormat())
      : inputValueState;
  }, [getDateFormat, getSelectedDate, inputValueState]);

  // set picker view range
  const setViewDate = useCallback(
    (date) => {
      const logError = function () {
        return log(`${date} is Invalid!`);
      };

      if (!date) return logError();

      let viewDate;
      if (typeof date === 'string') {
        viewDate = localMoment(date, getDateFormat());
      } else {
        viewDate = localMoment(date);
      }

      if (!viewDate || !viewDate.isValid()) return logError();
      setViewDateState(viewDate);
    },
    [getDateFormat, localMoment]
  );

  // switch to certain picker
  const navigate = useCallback(
    (mode) => {
      _showPicker(mode);
    },
    [_showPicker]
  );

  const callHandler = useCallback((method, e) => {
    if (!method) return true;
    return method(e) !== false;
  }, []);

  // sewitch view from effect change
  useEffect(() => {
    if (value) {
      setViewDate(value);
    }
  }, [value, locale, utc, displayZone, dateFormat, setViewDate]);

  // render input element
  const _renderInput = useMemo(() => {
    if (!input) return null;

    const _onInputChange = (e) => {
      if (!callHandler(inputProps.onChange, e)) return;

      const value = e.target ? e.target.value : e;
      const localMomentAlt = localMoment(value, getDateFormat());
      setInputValueState(value);

      if (localMomentAlt.isValid()) {
        setSelectedDateState(localMomentAlt);
        setViewDateState(localMomentAlt.clone().startOf('month'));
      } else {
        setSelectedDateState(null);
      }
      onChange(localMomentAlt.isValid() ? localMomentAlt : inputValueState);
    };

    const _onInputKeyDown = (e) => {
      if (!callHandler(inputProps.onKeyDown, e)) return;

      if (e.which === 9 && closeOnTab) {
        _closeCalendar();
      }
    };

    const _onInputFocus = (e) => {
      if (!callHandler(inputProps.onFocus, e)) return;
      _openCalendar();
    };

    const _onInputClick = (e) => {
      // Focus event should open the calendar, but there is some case where
      // the input is already focused and the picker is closed, so clicking the input
      // should open it again see https://github.com/arqex/react-datetime/issues/717

      if (!callHandler(inputProps.onClick, e)) return;
      _openCalendar();
    };

    const finalInputProps = {
      type: 'text',
      className: 'form-control',
      value: getInputValue(),
      ...inputProps,
      onFocus: _onInputFocus,
      onChange: _onInputChange,
      onKeyDown: _onInputKeyDown,
      onClick: _onInputClick
    };

    if (renderInput) {
      return (
        <div>{renderInput(finalInputProps, _openCalendar, _closeCalendar)}</div>
      );
    }

    return <input {...finalInputProps} />;
  }, [
    input,
    inputProps,
    renderInput,
    _closeCalendar,
    _openCalendar,
    getInputValue,
    callHandler,
    closeOnTab,
    getDateFormat,
    inputValueState,
    onChange,
    localMoment
  ]);

  // render picker calendar
  const _renderCalendar = useMemo(() => {
    const viewProps = {
      viewDate: viewDateState.clone(),
      selectedDate: getSelectedDate(),
      isValidDate,
      updateDate: _updateDate,
      navigate: _pickerNavigate,
      moment,
      showView: _showPicker
    };

    // Probably updateOn, updateSelectedDate and setDate can be merged in the same method
    // that would update viewDate or selectedDate depending on the view and the dateFormat
    switch (currentViewState) {
      case viewModes.YEARS:
        // Used viewProps
        // { viewDate, selectedDate, renderYear, isValidDate, navigate, showView, updateDate }
        viewProps.renderYear = renderYear;
        return <YearPicker {...viewProps} />;

      case viewModes.MONTHS:
        // { viewDate, selectedDate, renderMonth, isValidDate, navigate, showView, updateDate }
        viewProps.renderMonth = renderMonth;
        return <MonthPicker {...viewProps} />;

      case viewModes.DAYS:
        // { viewDate, selectedDate, renderDay, isValidDate, navigate, showView, updateDate, timeFormat
        viewProps.renderDay = renderDay;
        return <DayPicker {...viewProps} />;

      default:
        return '';
    }
  }, [
    isValidDate,
    renderYear,
    renderMonth,
    renderDay,
    _showPicker,
    _updateDate,
    _pickerNavigate,
    getSelectedDate,
    currentViewState,
    viewDateState
  ]);

  return (
    <ClickAwayWrapper className={getClassName()} onClickAway={_handleClickAway}>
      {_renderInput}
      <div className="dp-Picker">{_renderCalendar}</div>
    </ClickAwayWrapper>
  );
}

function log(message, method) {
  const con = typeof window !== 'undefined' && window.console;
  if (!con) return;

  if (!method) {
    method = 'warn';
  }
  con[method](`*Date-picker:${message}`);
}

function ClickAwayWrapper(props) {
  const { onClickAway, className, children } = props;
  const ref = useRef(null);

  useClickAway(ref, () => {
    onClickAway();
  });

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}

export default PickerContainer;
