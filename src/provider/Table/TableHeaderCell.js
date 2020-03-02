import React from 'react';

const TableHeaderCell = ({ style, sorting, sortKey, sortValue, sortIndex, onSortChange, children }) => {
  if (sorting && typeof onSortChange !== 'undefined') {
    const isSorted = sortIndex && sortIndex === sortKey && sortValue !== 0;

    return (
      <th
        style={style}
        tabIndex="-1"
        className="table-with-sort"
        role="button"
        onClick={() => onSortChange(sortIndex, sortValue)}
        onKeyPress={onSortChange}
      >
        {children}
        {isSorted && <span className={`la la-arrow-down text-primary ${sortValue === -1 ? 'rotate-180' : ''}`} />}
      </th>
    );
  }

  return <th style={style}>{children}</th>;
};

export default TableHeaderCell;
