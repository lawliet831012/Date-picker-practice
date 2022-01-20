import React, { useCallback, useMemo } from 'react';
import Nav from './Nav';

const disabledYearsCache = {};

function YearPicker(props) {
  const {
    renderYear = (props, year) => <td {...props}>{year}</td>,
    updateDate,
    viewDate,
    navigate,
    showView,
    selectedDate,
    isValidDate
  } = props;

  // update selected year to parent state
  const _updateSelectedYear = useCallback(
    (event) => {
      updateDate(event);
    },
    [updateDate]
  );

  // get Selected Year from props
  const getSelectedYear = useCallback(() => {
    return selectedDate && selectedDate.year();
  }, [selectedDate]);

  // check is year include valid date
  const isDisabledYear = useCallback(
    (year) => {
      const cache = disabledYearsCache;
      if (cache[year] !== undefined) {
        return cache[year];
      }

      if (!isValidDate) {
        return false;
      }

      // If one day in the year is valid, the year should be clickable
      const date = viewDate.clone().set({ year });
      let day = date.endOf('year').dayOfYear() + 1;

      while (day-- > 1) {
        if (isValidDate(date.dayOfYear(day))) {
          cache[year] = false;
          return false;
        }
      }

      cache[year] = true;
      return true;
    },
    [isValidDate, viewDate]
  );

  // get view years
  const getViewYear = useCallback(() => {
    return parseInt(viewDate.year() / 10, 10) * 10;
  }, [viewDate]);

  // render Navbar
  const renderNavigation = useMemo(() => {
    const viewYear = getViewYear();
    return (
      <Nav
        onClickPrev={() => navigate(-10, 'years')}
        onClickSwitch={() => showView('years')}
        onClickNext={() => navigate(10, 'years')}
        switchContent={`${viewYear}-${viewYear + 9}`}
      />
    );
  }, [getViewYear, navigate, showView]);

  // render year element
  const _renderYear = useCallback(
    (year, startOfDecade, endOfDecade) => {
      const selectedYear = getSelectedYear();
      let className = 'dp-Year';
      let onClick;

      if (year === startOfDecade) {
        className += ' dp-Old';
      } else if (year === endOfDecade - 1) {
        className += ' dp-New';
      }
      if (isDisabledYear(year)) {
        className += ' dp-Disabled';
      } else {
        onClick = _updateSelectedYear;
      }

      if (selectedYear === year) {
        className += ' dp-Active';
      }

      const props = { key: year, className, 'data-value': year, onClick };

      return renderYear(props, year, selectedDate && selectedDate.clone());
    },
    [
      _updateSelectedYear,
      getSelectedYear,
      isDisabledYear,
      renderYear,
      selectedDate
    ]
  );

  // render years element
  const renderYears = useMemo(() => {
    const viewYear = getViewYear();
    // 12 years in 3 rows for every view
    const rows = [[], [], []];
    const startOfDecade = viewYear - 1;
    const endOfDecade = viewYear + 11;
    for (let year = startOfDecade; year < endOfDecade; year++) {
      const row = getRow(rows, year - viewYear);

      row.push(_renderYear(year, startOfDecade, endOfDecade));
    }

    return rows.map((years, i) => <tr key={i}>{years}</tr>);
  }, [getViewYear, _renderYear]);

  return (
    <div className="dp-Years">
      <table>
        <thead>{renderNavigation}</thead>
      </table>
      <table>
        <tbody>{renderYears}</tbody>
      </table>
    </div>
  );
}

function getRow(rows, year) {
  if (year < 3) {
    return rows[0];
  }
  if (year < 7) {
    return rows[1];
  }

  return rows[2];
}

export default YearPicker;
