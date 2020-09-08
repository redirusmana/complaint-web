import React from "react";
import get from "lodash/get";
import Table from ".";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE,
  getSortObject
} from "../Tools/converter";
import request from "../Tools/api";

class TableFull extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      loading: false,
      error: "",
      page: props.initialPage,
      perPage: props.initialPerPage,
      totalItems: props.initialTotalItems,
      search: props.initialSearch,
      sortKey: props.initialSortKey,
      sortOrder: props.initialSortOrder,
      sortValue: props.initialSortValue
    };

    this.loadSourceInit = this.loadSourceInit.bind(this);
    this.loadSourceStart = this.loadSourceStart.bind(this);

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentDidMount() {
    this.loadSourceInit();
  }

  componentWillUnmount() {
    if (typeof this._apiSource !== "undefined") {
      this._apiSource.cancel();
    }
  }

  loadSourceInit() {
    this.setState(
      {
        loading: true,
        error: ""
      },
      () => {
        this.loadSourceStart();
      }
    );
  }

  async loadSourceStart() {
    try {
      const {
        dataUrl,
        dataFetch,
        accessorData,
        accessorPage,
        accessorTotal
      } = this.props;
      const { page, perPage, sortKey, sortOrder, search } = this.state;
      this._apiSource = request.generateCancelToken();

      const tableParams = {
        page,
        perPage,
        sortKey,
        sortOrder,
        title: search
      };

      let response;
      if (dataUrl) {
        response = await request.get(dataUrl, this._apiSource.token, {
          params: tableParams
        });
      } else if (typeof dataFetch === "function") {
        response = await dataFetch(this._apiSource.token, tableParams);
      }

      if (response && response.data) {
        this.setState({
          dataSource: get(response.data, accessorData),
          page: get(response.data, accessorPage),
          totalItems: get(response.data, accessorTotal),
          loading: false
        });
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }

      this.setState({
        loading: false,
        error
      });
    }
  }

  handlePageChange(page) {
    this.setState(
      {
        page
      },
      () => {
        this.loadSourceInit();
      }
    );
  }

  handlePerPageChange(perPage) {
    this.setState(
      {
        perPage
      },
      () => {
        this.loadSourceInit();
      }
    );
  }

  handleSearchChange(search) {
    this.setState(
      {
        search
      },
      () => {
        this.loadSourceInit();
      }
    );
  }

  handleSortChange(name, value) {
    const { sortKey } = this.state;
    let newSortValue = 1;
    const sortObject = getSortObject(value);
    if (sortKey === name) {
      if (sortObject.sortValue > 0) {
        newSortValue = -1;
      } else if (sortObject.sortValue === -1) {
        newSortValue = 0;
      }
    }
    const newSortObject = getSortObject(newSortValue);
    this.setState(
      {
        sortKey: name,
        sortOrder: newSortObject.sortOrder,
        sortValue: newSortObject.sortValue
      },
      () => {
        this.loadSourceInit();
      }
    );
  }

  render() {
    const { columns, name, onRowFocus } = this.props;
    const {
      dataSource,
      loading,
      error,
      page,
      perPage,
      totalItems,
      sortKey,
      sortValue
    } = this.state;

    const totalPage = Math.ceil(totalItems / perPage);

    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        name={name}
        search
        sorting
        clientControl={false}
        showRowNumber
        onSearchChange={this.handleSearchChange}
        onSortChange={this.handleSortChange}
        isLoading={loading}
        error={error}
        pagination={{
          currentPage: page,
          maxItem: perPage,
          totalPage,
          onPageChange: this.handlePageChange,
          onMaxItemChange: this.handlePerPageChange
        }}
        initialSortKey={sortKey}
        initialSortValue={sortValue}
        onRowFocus={onRowFocus}
      />
    );
  }
}

TableFull.defaultProps = {
  columns: [],
  onRowFocus: () => {},
  accessorData: "data",
  accessorPage: "page",
  accessorTotal: "total",
  initialPage: 1,
  initialPerPage: 20,
  initialTotalItems: 0,
  initialSearch: "",
  initialSortKey: "",
  initialSortValue: 0,
  initialSortOrder: ""
};

export default TableFull;
