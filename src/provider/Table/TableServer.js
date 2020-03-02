import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import kebabCase from 'lodash/kebabCase';
import Pagination from '../display/Pagination';
import InputSelect from '../form/InputSelect';
import InputSearch from '../form/InputSearch';
import TableDataRow from './TableDataRow';
import TableHeaderCell from './TableHeaderCell';
import { MAX_ITEM_OPTIONS } from './constant';
import LoadingCard from '../display/LoadingCard';
import { isDevelopment } from '../../configs/general';
import Alert from '../display/Alert';

const TableServer = ({
  name,
  title,
  headerSubtitle,
  isLoading,
  search,
  pageControl,
  pagination,
  showHeader,
  showRowNumber,
  showPagination,
  columns,
  dataSource,
  sorting,
  onRowFocus,
  onRowDoubleClick,
  onSearchChange,
  onSortChange,
  initialSearch,
  initialSortKey,
  initialSortValue,
  error,
  tableClass,
  isHoverable,
  isStripped,
  isNoWrap,
  isCard,
  isResponsive,
  tableFooter,
  tableHeader
}) => {
  const tableClassName = cn({
    table: true,
    'table-vcenter': true,
    'table-hover': isHoverable,
    'table-striped': isStripped,
    'text-nowrap': isNoWrap,
    'card-table': isCard,
    [tableClass]: !!tableClass
  });

  let isPaginationShow = true;
  if (!showPagination) {
    isPaginationShow = false;
  } else if (typeof pagination === 'boolean' && !pagination) {
    isPaginationShow = false;
  }

  const tableWrapperCn = cn({
    'table-responsive': isResponsive,
    'w-100': !isResponsive
  });
  return (
    <div className="table-container">
      {(title || search || pageControl) && (
        <div className="table-controls">
          {title && (
            <div className="table-controls-header">
              {title}
              {headerSubtitle}
            </div>
          )}
          <div className="ml-auto form-inline">
            {search && <InputSearch name={name} initialSearch={initialSearch} onSearchChange={onSearchChange} />}
            {pageControl && (
              <InputSelect
                name={`${name}-page-options`}
                options={MAX_ITEM_OPTIONS}
                defaultValue={pagination.maxItem}
                allowClear={false}
                wrapClassName="w-auto ml-2"
                handleChange={pagination.onMaxItemChange}
              />
            )}
          </div>
        </div>
      )}
      {error && isDevelopment && <Alert type="error" message="Request Error" description={error} showIcon />}
      <div className={tableWrapperCn}>
        <table className={tableClassName}>
          {showHeader && (
            <thead className="table-header">
              <tr>
                {showRowNumber && <th className="table-number-index">No.</th>}
                {columns.length > 0 &&
                  columns.map(column => {
                    const headerSorting = typeof column.sorting !== 'undefined' ? column.sorting : sorting;
                    return (
                      <TableHeaderCell
                        key={`table-head-${kebabCase(name)}-${column.dataIndex}`}
                        style={column.headerStyle ? column.headerStyle : column.style}
                        sorting={headerSorting}
                        onSortChange={onSortChange}
                        sortKey={initialSortKey}
                        sortValue={initialSortValue}
                        sortIndex={column.sortIndex || column.dataIndex}
                      >
                        {column.label}
                      </TableHeaderCell>
                    );
                  })}
              </tr>
            </thead>
          )}
          {tableHeader}
          <tbody className="table-body">
            {isLoading ? (
              <tr>
                <td colSpan={showRowNumber ? columns.length + 1 : columns.length}>
                  <LoadingCard />
                </td>
              </tr>
            ) : (
              <TableDataRow
                dataSource={dataSource}
                columns={columns}
                name={name}
                onRowFocus={onRowFocus}
                onRowDoubleClick={onRowDoubleClick}
                showRowNumber={showRowNumber}
                page={pagination.currentPage}
                maxItem={pagination.maxItem}
              />
            )}
          </tbody>
          {tableFooter}
        </table>
      </div>
      {isPaginationShow && (
        <div className="table-pagination">
          <Pagination
            name={`${name}-pagination`}
            currentPage={pagination.currentPage}
            totalItem={pagination.totalItem}
            maxItem={pagination.maxItem}
            totalPage={pagination.totalPage}
            handleClick={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
};

TableServer.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  dataSource: PropTypes.arrayOf(PropTypes.shape({})),
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  search: PropTypes.bool,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({})]),
  sorting: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({})]),
  pageControl: PropTypes.bool,
  showRowNumber: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialSearch: PropTypes.string,
  initialSortKey: PropTypes.string,
  initialSortValue: PropTypes.number,
  onRowFocus: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onRowDoubleClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onSearchChange: PropTypes.func,
  onSortChange: PropTypes.func,
  isLoading: PropTypes.bool,
  tableClass: PropTypes.string,
  isHoverable: PropTypes.bool,
  isStripped: PropTypes.bool,
  isNoWrap: PropTypes.bool,
  isCard: PropTypes.bool,
  isResponsive: PropTypes.bool,
  showPagination: PropTypes.bool
};

TableServer.defaultProps = {
  dataSource: [],
  search: false,
  sorting: false,
  pagination: {
    currentPage: 1,
    maxItem: 10,
    totalItem: 0,
    totalPage: 1,
    onPageChange: () => {}
  },
  title: '',
  pageControl: true,
  showHeader: true,
  showRowNumber: false,
  initialSearch: '',
  initialSortKey: '',
  initialSortValue: 0,
  onRowFocus: false,
  onRowDoubleClick: false,
  onSearchChange: () => {},
  onSortChange: () => {},
  isLoading: false,
  tableClass: '',
  isHoverable: true,
  isStripped: true,
  isNoWrap: true,
  isCard: true,
  isResponsive: true,
  showPagination: true
};

export default TableServer;
