import React, { useCallback, useMemo } from 'react';
import Nav from './Nav';

function DayPicker(props) {
  const {
    isValidDate = () => true,
    renderDay = (props, date) => <td {...props}>{date.date()}</td>,
    viewDate,
    selectedDate,
    moment,
    updateDate,
    navigate,
    showView
  } = props;

  // update selected year to parent state
  const _setDate = useCallback(
    (e) => {
      updateDate(e);
    },
    [updateDate]
  );

  // render Navbar
  const renderNavigation = useMemo(() => {
    const date = viewDate;
    const locale = date.localeData();
    return (
      <Nav
        onClickPrev={() => navigate(-1, 'months')}
        onClickSwitch={() => showView('months')}
        onClickNext={() => navigate(1, 'months')}
        switchContent={`${locale.months(date)} ${date.year()}`}
        switchColSpan={5}
        switchProps={{ 'data-value': viewDate.month() }}
      />
    );
  }, [viewDate, navigate, showView]);

  // render day of week header
  const renderDayHeaders = useMemo(() => {
    const locale = viewDate.localeData();
    const dayItems = getDaysOfWeek(locale).map((day, index) => (
      <th key={day + index} className="dow">
        {day}
      </th>
    ));

    return <tr>{dayItems}</tr>;
  }, [viewDate]);

  // render day element
  const _renderDay = useCallback(
    (date, startOfMonth, endOfMonth) => {
      const dayProps = {
        key: date.format('M_D'),
        'data-value': date.date(),
        'data-month': date.month(),
        'data-year': date.year()
      };

      let className = 'dp-Day';
      if (date.isBefore(startOfMonth)) {
        className += ' dp-Old';
      } else if (date.isAfter(endOfMonth)) {
        className += ' dp-New';
      }
      if (selectedDate && date.isSame(selectedDate, 'day')) {
        className += ' dp-Active';
      }
      if (date.isSame(moment(), 'day')) {
        className += ' dp-Today';
      }

      if (isValidDate(date)) {
        dayProps.onClick = _setDate;
      } else {
        className += ' dp-Disabled';
      }

      dayProps.className = className;

      return renderDay(
        dayProps,
        date.clone(),
        selectedDate && selectedDate.clone()
      );
    },
    [_setDate, isValidDate, moment, renderDay, selectedDate]
  );

  // render days element
  const renderDays = useMemo(() => {
    const date = viewDate;
    const startOfMonth = date.clone().startOf('month');
    const endOfMonth = date.clone().endOf('month');

    // We need 42 days in 6 rows
    // starting in the last week of the previous month
    const rows = [[], [], [], [], [], []];

    const startDate = date.clone().subtract(1, 'months');
    startDate.date(startDate.daysInMonth()).startOf('week');

    const endDate = startDate.clone().add(42, 'd');
    let i = 0;

    while (startDate.isBefore(endDate)) {
      const row = getRow(rows, i++);
      row.push(_renderDay(startDate, startOfMonth, endOfMonth));
      startDate.add(1, 'd');
    }

    return rows.map((r, i) => <tr key={`${endDate.month()}_${i}`}>{r}</tr>);
  }, [viewDate, _renderDay]);

  return (
    <div className="dp-Days">
      <table>
        <thead>
          {renderNavigation}
          {renderDayHeaders}
        </thead>
        <tbody>{renderDays}</tbody>
      </table>
    </div>
  );
}

function getRow(rows, day) {
  return rows[Math.floor(day / 7)];
}

// get day of week from moment
function getDaysOfWeek(locale) {
  const first = locale.firstDayOfWeek();
  const dow = [];
  let i = 0;

  locale._weekdaysMin.forEach(function (day) {
    dow[(7 + i++ - first) % 7] = day;
  });

  return dow;
}

export default DayPicker;
