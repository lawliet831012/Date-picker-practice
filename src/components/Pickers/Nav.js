import React from 'react';

function Nav(props) {
  const {
    onClickPrev,
    onClickSwitch,
    onClickNext,
    switchContent,
    switchColSpan,
    switchProps
  } = props;
  return (
    <tr>
      <th className="dp-Prev" onClick={onClickPrev}>
        <span>‹</span>
      </th>
      <th
        className="dp-Switch"
        colSpan={switchColSpan}
        onClick={onClickSwitch}
        {...switchProps}
      >
        {switchContent}
      </th>
      <th className="dp-Next" onClick={onClickNext}>
        <span>›</span>
      </th>
    </tr>
  );
}

export default Nav;
