import React, { useCallback, useMemo } from 'react';
import Nav from './Nav';

function MonthPicker(props) {
  const {
    updateDate,
    viewDate,
    navigate,
    showView,
    selectedDate,
    isValidDate,
    renderMonth
  } = props;

  // update selected year to parent state
  const _updateSelectedMonth = useCallback(
    (e) => {
      updateDate(e);
    },
    [updateDate]
  );

  // check is month include valid date
  const isDisabledMonth = useCallback(
    (month) => {
      if (!isValidDate) {
        // If no validator is set, all days are valid
        return false;
      }

      // If one day in the month is valid, the year should be clickable
      const date = viewDate.clone().set({ month });
      let day = date.endOf('month').date() + 1;

      while (day-- > 1) {
        if (isValidDate(date.date(day))) {
          return false;
        }
      }
      return true;
    },
    [isValidDate, viewDate]
  );

  // render Navbar
  const renderNavigation = useMemo(() => {
    const year = viewDate.year();

    return (
      <Nav
        onClickPrev={() => navigate(-1, 'years')}
        onClickSwitch={() => showView('years')}
        onClickNext={() => navigate(1, 'years')}
        switchContent={year}
        switchColSpan="2"
      />
    );
  }, [navigate, showView, viewDate]);

  // get month text from locale
  const getMonthText = useCallback(
    (month) => {
      const localMoment = viewDate;
      const monthStr = localMoment
        .localeData()
        .monthsShort(localMoment.month(month));

      // Because some months are up to 5 characters long, we want to
      // use a fixed string length for consistency
      return capitalize(monthStr.substring(0, 3));
    },
    [viewDate]
  );

  // render month element
  const _renderMonth = useCallback(
    (month) => {
      let className = 'dp-Month';
      let onClick;

      if (isDisabledMonth(month)) {
        className += ' dp-Disabled';
      } else {
        onClick = _updateSelectedMonth;
      }

      if (
        selectedDate &&
        selectedDate.year() === viewDate.year() &&
        selectedDate.month() === month
      ) {
        className += ' dp-Active';
      }

      const monthProps = {
        key: month,
        className,
        'data-value': month,
        onClick
      };

      if (renderMonth) {
        return renderMonth(
          monthProps,
          month,
          viewDate.year(),
          selectedDate && selectedDate.clone()
        );
      }

      return <td {...monthProps}>{getMonthText(month)}</td>;
    },
    [
      _updateSelectedMonth,
      getMonthText,
      renderMonth,
      isDisabledMonth,
      selectedDate,
      viewDate
    ]
  );

  // render months element
  const renderMonths = useMemo(() => {
    // 12 months in 3 rows for every view
    const rows = [[], [], []];

    for (let month = 0; month < 12; month++) {
      const row = getRow(rows, month);

      row.push(_renderMonth(month));
    }

    return rows.map((months, i) => <tr key={i}>{months}</tr>);
  }, [_renderMonth]);

  return (
    <div className="dp-Months">
      <table>
        <thead>{renderNavigation}</thead>
      </table>
      <table>
        <tbody>{renderMonths}</tbody>
      </table>
    </div>
  );
}

function getRow(rows, year) {
  if (year < 4) {
    return rows[0];
  }
  if (year < 8) {
    return rows[1];
  }

  return rows[2];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default MonthPicker;
