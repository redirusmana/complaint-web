import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';
import Fuse from 'fuse.js';
import Pagination from '../display/Pagination';
import InputSelect from '../form/InputSelect';
import InputSearch from '../form/InputSearch';
import { MAX_ITEM_OPTIONS } from './constant';
import TableDataRow from './TableDataRow';
import TableHeaderCell from './TableHeaderCell';

const sortDataSource = (data, sortKey, sortValue) =>
  data.sort((a, b) => {
    if (get(a, sortKey) > get(b, sortKey)) {
      return sortValue;
    }

    if (get(a, sortKey) < get(b, sortKey)) {
      return -1 * sortValue;
    }

    return 0;
  });

class TableClient extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { initialSortKey, initialSortValue, dataSource, pagination } = props;

    const sortedDataSource = sortDataSource(
      dataSource,
      initialSortKey || state.sortKey,
      initialSortValue || state.sortValue
    );

    const sortKey = initialSortKey || state.sortKey;
    const sortValue = initialSortValue || state.sortValue;
    const page = pagination && pagination.currentPage !== 0 ? pagination.currentPage : state.page;
    const maxItem =
      pagination && pagination.maxItem !== 0 ? pagination.maxItem || sortedDataSource.length : state.maxItem;
    const totalItem = sortedDataSource.length;
    const totalPage = Math.ceil(totalItem / maxItem);

    const startSlice = (page - 1) * maxItem;
    const endSlice = page * maxItem;
    const updatedDataSource = sortedDataSource.slice(startSlice, endSlice);
    return {
      sortKey,
      sortValue,
      page,
      maxItem,
      dataSource: updatedDataSource,
      totalItem,
      totalPage
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      sortKey: '',
      sortValue: 0,
      page: 1,
      totalItem: 0,
      maxItem: MAX_ITEM_OPTIONS[0].value,
      totalPage: 0
    };
  }

  onSearchChange = value => {
    const { dataSource: propsDataSource, searchKey } = this.props;

    const { sortKey, sortValue, maxItem } = this.state;
    const sortedDataSource = sortDataSource(propsDataSource, sortKey, sortValue);

    const fuzzySearch = new Fuse(sortedDataSource, {
      shouldSort: false,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [searchKey]
    });

    const filteredDataSource = value !== '' ? fuzzySearch.search(value) : sortedDataSource;

    const totalPage = maxItem > 0 ? Math.ceil(filteredDataSource.length / maxItem) : 1;

    const usedPage = 1;

    this.setState({
      dataSource: filteredDataSource.slice((usedPage - 1) * maxItem, usedPage * maxItem),
      totalItem: filteredDataSource.length,
      page: usedPage,
      totalPage
    });
  };

  onSortChange = (name, sortValue) => {
    const { sortKey, page, maxItem } = this.state;
    const { dataSource: propsDataSource } = this.props;

    let newSortValue = 1;
    if (sortKey === name) {
      if (sortValue > 0) {
        newSortValue = -1;
      } else {
        newSortValue = 0;
      }
    } else {
      newSortValue = 1;
    }

    const sortedDataSource = newSortValue !== 0 ? sortDataSource(propsDataSource, name, newSortValue) : propsDataSource;

    this.setState({
      sortKey: newSortValue !== 0 ? name : '',
      sortValue: newSortValue,
      dataSource: sortedDataSource.slice((page - 1) * maxItem, page * maxItem)
    });
  };

  onPageChange = page => {
    const { dataSource } = this.props;
    const { maxItem } = this.state;

    this.setState({
      page,
      dataSource: dataSource.slice((page - 1) * maxItem, page * maxItem)
    });
  };

  onMaxItemChange = value => {
    const { page } = this.state;
    const { dataSource } = this.props;
    const usedValue = value < 1 ? dataSource.length : value;
    const totalPage = Math.ceil(dataSource.length / usedValue);
    const usedPage = totalPage < page ? totalPage : totalPage;

    this.setState({
      maxItem: usedValue,
      page: usedPage,
      dataSource: dataSource.slice((usedPage - 1) * usedValue, usedPage * usedValue),
      totalPage
    });
  };

  renderDataHeader() {
    const { showRowNumber, columns, name, sorting } = this.props;
    const { sortKey, sortValue } = this.state;
    return (
      <tr>
        {showRowNumber && <th className="table-number-index">No.</th>}
        {columns.length > 0 &&
          columns.map(column => (
            <TableHeaderCell
              key={`table-head-${kebabCase(name)}-${column.dataIndex}`}
              style={column.style}
              sorting={sorting}
              onSortChange={() => this.onSortChange(column.sortIndex || column.dataIndex)}
              sortKey={sortKey}
              sortValue={sortValue}
              sortIndex={column.sortIndex || column.dataIndex}
            >
              {column.label}
            </TableHeaderCell>
          ))}
      </tr>
    );
  }

  renderDataPagination() {
    const { pagination, name, showPagination } = this.props;
    const { page, totalItem, maxItem, totalPage } = this.state;

    if ((typeof pagination === 'boolean' && !pagination) || !showPagination) {
      return null;
    }

    return (
      <div className="table-pagination">
        <Pagination
          name={`${name}-pagination`}
          currentPage={page}
          totalItem={totalItem}
          maxItem={maxItem}
          totalPage={totalPage}
          handleClick={nextPage => this.onPageChange(nextPage)}
          shortStat={pagination.shortStat}
          maxNumberShow={pagination.maxNumberShow}
        />
      </div>
    );
  }

  render() {
    const {
      name,
      search,
      title,
      pageControl,
      initialSearch,
      onRowFocus,
      onRowDoubleClick,
      columns,
      showRowNumber,
      tableClass,
      showHeader,
      isHoverable,
      isStripped,
      isNoWrap,
      isCard,
      isResponsive
    } = this.props;
    const { dataSource, page, maxItem } = this.state;

    const tableWrapperCn = cn({
      'table-responsive': isResponsive,
      'w-100': !isResponsive
    });

    const tableClassName = cn({
      table: true,
      'table-vcenter': true,
      'table-hover': isHoverable,
      'table-striped': isStripped,
      'text-nowrap': isNoWrap,
      'card-table': isCard,
      [tableClass]: !!tableClass
    });

    return (
      <div className="table-container">
        {(title || search || pageControl) && (
          <div className="table-controls">
            {title && <div className="table-controls-header">{title}</div>}
            <div className="ml-auto form-inline">
              {search && (
                <InputSearch
                  name={name}
                  initialSearch={initialSearch}
                  onSearchChange={value => this.onSearchChange(value)}
                />
              )}
              {pageControl && (
                <InputSelect
                  name={`${name}-page-options`}
                  options={[...MAX_ITEM_OPTIONS].concat([
                    {
                      label: 'Show All',
                      value: -1
                    }
                  ])}
                  value={this.state.maxItem}
                  allowClear={false}
                  wrapClassName="w-auto ml-2"
                  handleChange={this.onMaxItemChange}
                />
              )}
            </div>
          </div>
        )}
        <div className={tableWrapperCn}>
          <table className={tableClassName}>
            {showHeader && <thead className="table-header">{this.renderDataHeader()}</thead>}
            <tbody className="table-body">
              <TableDataRow
                dataSource={dataSource}
                columns={columns}
                name={name}
                onRowFocus={onRowFocus}
                onRowDoubleClick={onRowDoubleClick}
                showRowNumber={showRowNumber}
                page={page}
                maxItem={maxItem}
              />
            </tbody>
          </table>
        </div>
        {this.renderDataPagination()}
      </div>
    );
  }
}

TableClient.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  dataSource: PropTypes.arrayOf(PropTypes.shape({})),
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  search: PropTypes.bool,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({})]),
  showPagination: PropTypes.bool,
  sorting: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({})]),
  pageControl: PropTypes.bool,
  showRowNumber: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialSearch: PropTypes.string,
  initialSortKey: PropTypes.string,
  initialSortValue: PropTypes.number,
  onRowFocus: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onRowDoubleClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  tableClass: PropTypes.string,
  searchKey: PropTypes.string,
  isHoverable: PropTypes.bool,
  isStripped: PropTypes.bool,
  isNoWrap: PropTypes.bool,
  isCard: PropTypes.bool,
  isResponsive: PropTypes.bool
};

TableClient.defaultProps = {
  dataSource: [],
  search: false,
  sorting: false,
  pagination: {
    currentPage: 1,
    maxItem: 10
  },
  title: '',
  pageControl: true,
  showRowNumber: false,
  showHeader: true,
  showPagination: true,
  initialSearch: '',
  initialSortKey: '',
  initialSortValue: 0,
  onRowFocus: false,
  onRowDoubleClick: false,
  tableClass: 'text-nowrap',
  searchKey: 'name',
  isHoverable: true,
  isStripped: true,
  isNoWrap: true,
  isCard: true,
  isResponsive: true
};

export default TableClient;
