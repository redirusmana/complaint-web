import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';

const TableDataRow = ({ dataSource, columns, name, onRowFocus, onRowDoubleClick, showRowNumber, page, maxItem }) => {
  if (Array.isArray(dataSource) && dataSource.length > 0) {
    return dataSource.map((datum, i) => (
      <tr
        key={`table-row-${kebabCase(name)}-${i}`}
        tabIndex="-1"
        role="button"
        onClick={e => {
          if (typeof onRowFocus === 'function') {
            onRowFocus(datum, e);
          }
        }}
        onKeyPress={e => {
          if (typeof onRowFocus === 'function') {
            onRowFocus(datum, e);
          }
        }}
        onDoubleClick={e => {
          if (typeof onRowDoubleClick === 'function') {
            onRowDoubleClick(datum, e);
          }
        }}
      >
        {showRowNumber && <td className="table-number-index">{(page - 1) * maxItem + i + 1}</td>}
        {columns.length > 0 &&
          columns.map(column => {
            const cellStyle = typeof column.renderStyle === 'function' ? column.renderStyle(datum, i) : column.style;

            if (typeof column.renderRowCell === 'function') {
              const { renderRowCell: CustomCellComponent } = column;

              return (
                <td key={`table-cell-${kebabCase(name)}-${i}-${column.dataIndex}`} style={cellStyle}>
                  <CustomCellComponent record={datum} number={i} />
                </td>
              );
            }

            return (
              <td key={`table-cell-${kebabCase(name)}-${i}-${column.dataIndex}`} style={cellStyle}>
                {typeof get(datum, column.dataIndex) !== 'undefined' && get(datum, column.dataIndex)}
              </td>
            );
          })}
      </tr>
    ));
  }

  return (
    <tr style={{ width: '100%' }}>
      <td colSpan={showRowNumber ? columns.length + 1 : columns.length} className="text-center">
        Data is empty
      </td>
    </tr>
  );
};

TableDataRow.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.shape({})),
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  name: PropTypes.string,
  onRowFocus: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onRowDoubleClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  showRowNumber: PropTypes.bool,
  page: PropTypes.number,
  maxItem: PropTypes.number
};

TableDataRow.defaultProps = {
  dataSource: [],
  columns: [],
  name: '',
  onRowFocus: false,
  onRowDoubleClick: false,
  showRowNumber: false,
  page: 1,
  maxItem: 0
};

export default TableDataRow;
