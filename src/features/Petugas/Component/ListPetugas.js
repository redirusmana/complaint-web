import React from "react";
import { Link } from "react-router-dom";
// import get from "lodash/get";
import api from "../../../provider/Tools/api";
import Table from "../../../provider/Table/TableServer";
import popConfirm from "../../../provider/Display/popConfirm";
import alertFloat from "../../../provider/Display/alertFloat";
import {
  // dateFullString,
  axiosError,
  AXIOS_CANCEL_MESSAGE,
  arrayToObject,
  getSortObject
} from "../../../provider/Tools/converter";
import { PAGE_OFFICERS_CREATE } from "../action";
import PageHeader from "../../../provider/Display/PageHeader";
import FetchResource from "../../../provider/Tools/FetchResource";
import FilterOptions from "../../../provider/Commons/FilterOptions";
import {
  apiOfficersGet,
  apiOfficersFilter,
  apiOfficersDelete
} from "../action";

class ListPetugas extends React.Component {
  configFilter = [{ type: "select", title: "Jenis Kelamin", key: "gender" }];

  constructor(props) {
    super(props);

    this.state = {
      queries: arrayToObject(this.configFilter, "key", true),
      filter: {},

      sortKey: "",
      sortValue: 0,
      sortOrder: "",

      page: 1,
      totalPaginate: 10,
      perPage: 10,
      increment: 1
    };
  }

  componentDidMount() {
    this.fetchConfig();
  }

  fetchConfig = async () => {
    try {
      this._requestSource = api.generateCancelToken();
      const { data } = await api.get(
        apiOfficersFilter,
        this._requestSource.token
      );
      this.setState({
        filter: data
      });
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
      alertFloat({
        type: "error",
        content: error
      });
    }
  };

  handleFilterChange = (key, value) => {
    const { queries } = this.state;
    const configs = Array.from(this.configFilter);
    const foundDepends = configs.filter(
      config => Array.isArray(config.depends) && config.depends.includes(key)
    );

    const newQueries = {
      ...queries,
      [key]: value
    };

    if (foundDepends) {
      foundDepends.forEach(item => {
        newQueries[item.key] = undefined;
      });
    }

    this.setState({
      queries: newQueries
    });
  };

  handleSortChange = (name, value) => {
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
    this.setState({
      sortKey: name,
      sortOrder: newSortObject.sortOrder,
      sortValue: newSortObject.sortValue
    });
  };

  handleSearch = value => {
    this.setState({
      search: value
    });
  };

  handlePageChange = page => {
    this.setState({
      page
    });
  };

  handleRowDetail = record => {
    const { history } = this.props;
    history.push(`/master-data/petugas/detail/${record.id}`);
  };

  handleRowEdit = record => {
    const { history } = this.props;
    history.push(`/master-data/petugas/edit/${record.id}`);
  };

  handleRemoveLegal = record => {
    popConfirm({
      title: `Are you sure to remove this Officers?`,
      message: "Officers will deleted permanently",
      okText: " Yes",
      cancelText: " No",
      onOkay: async () => {
        try {
          this._requestSource = api.generateCancelToken();
          const { status } = await apiOfficersDelete(
            record.id,
            this._requestSource.token
          );
          if (status === 200) {
            alertFloat({
              type: "success",
              content: "Berhasil Menghapus Officers"
            });
            this.setState(prevState => ({
              increment: prevState.increment + 1
            }));
          }
        } catch (e) {
          const error = axiosError(e);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }

          alertFloat({
            type: "error",
            content: error
          });
        }
      },
      onCancel: () => {},
      okType: "danger"
    });
  };

  render() {
    // console.log(this.state);

    // const { user } = this.props;
    const {
      page,
      perPage,
      search,
      increment,
      totalPaginate,
      queries,
      filter,
      sortKey,
      sortOrder,
      sortValue
    } = this.state;
    const columns = [
      // {
      //   label: "NIK",
      //   dataIndex: "nik",
      //   renderRowCell: ({ record }) => (record.nik ? record.nik : " - ")
      // },
      {
        label: "Nama",
        dataIndex: "name",
        renderRowCell: ({ record }) => {
          const { user } = record;
          return user ? user.name : " - ";
        }
      },
      // {
      //   label: "Username",
      //   dataIndex: "username",
      //   renderRowCell: ({ record }) =>
      //     record.username ? record.username : " - "
      // },
      {
        label: "Jenis Kelamin",
        dataIndex: "gender",
        renderRowCell: ({ record }) => (record.gender ? record.gender : " - ")
      },
      {
        label: "Alamat",
        dataIndex: "address",
        renderRowCell: ({ record }) => (record.address ? record.address : " - ")
      },
      {
        label: "Tempat, Tanggal Lahir",
        dataIndex: "birthday_place",
        renderRowCell: ({ record }) => {
          const { birthday_date, birthday_place } = record;
          return record ? `${birthday_place}, ${birthday_date}` : " - ";
        }
      },
      {
        label: "Email",
        dataIndex: "email",
        renderRowCell: ({ record }) => {
          const { user } = record;
          return user ? user.email : " - ";
        }
      },
      {
        label: "Telepon",
        dataIndex: "phone_number",

        renderRowCell: ({ record }) =>
          record.phone_number ? record.phone_number : " - "
      },
      {
        label: "Action",
        dataIndex: "action",
        sorting: false,
        style: {
          width: 80,
          textAlign: "center"
        },
        renderRowCell: ({ record }) => {
          return (
            <React.Fragment>
              <button
                type="button"
                className="btn btn-primary btn-icon-only mr-1"
                onClick={() => this.handleRowEdit(record)}
                title="Edit Request"
              >
                <i className="la la-edit" style={{ fontSize: "20px" }} />
              </button>
              <button
                type="button"
                className="btn btn-danger btn-icon-only mr-1"
                onClick={() => this.handleRemoveLegal(record)}
                title="Delete Request"
              >
                <i className="la la-trash" style={{ fontSize: "18px" }} />
              </button>
            </React.Fragment>
          );
        }
      }
    ];

    return (
      <React.Fragment>
        <PageHeader
          title="Petugas"
          subtitle={
            <div className="breadcrumb pb-0">
              <div className="breadcrumb-item">
                <i className="la la-home" /> Daftar Petugas
              </div>
            </div>
          }
          showWrapper
        >
          <div className="page-options form-inline">
            <div className="d-flex flex-row my-2 align-items-center">
              <div className="page-options">
                <Link
                  to={PAGE_OFFICERS_CREATE}
                  className="btn btn-md btn-primary mr-1"
                >
                  <i className="la la-user-plus" />
                  Membuat Petugas Baru
                </Link>
              </div>
            </div>
          </div>
        </PageHeader>

        <FilterOptions
          id="filter-list-officers"
          title="Your Request"
          configs={this.configFilter}
          options={filter}
          queries={queries}
          onFilterChange={this.handleFilterChange}
          headerWrapper={({ children }) => (
            <div className="d-flex flex-row align-items-center mb-2">
              {/* <h5 className="mb-0">Filter Petugas</h5> */}
              <div className="ml-auto">{children}</div>
            </div>
          )}
          showInPageHeader={false}
          defaultOpenCollapse={false}
        />
        <FetchResource
          key={`table-petugas-list-${increment}`}
          dataUrl={apiOfficersGet}
          queryParams={{
            ...queries,
            page,
            perPage,
            totalPaginate,
            search,
            sortKey,
            sortOrder,
            paginate: true
          }}
          render={({ dataSource, error, loading }) => {
            const { pagination } = dataSource;
            const totalPage = pagination ? pagination.lastPage : 0;
            return (
              <div className="card mt-2">
                <div className="card-body p-1">
                  <Table
                    name="list-petugas"
                    columns={columns}
                    dataSource={dataSource.data}
                    pageControl={false}
                    showRowNumber
                    sorting
                    onSortChange={this.handleSortChange}
                    initialSortKey={sortKey}
                    initialSortValue={sortValue}
                    search={false}
                    onSearchChange={value => this.handleSearch(value)}
                    pagination={{
                      currentPage: page,
                      maxItem: perPage,
                      totalPage,
                      totalItem: pagination ? pagination.total : 0,
                      onPageChange: this.handlePageChange
                    }}
                    onRowFocus={() => {}}
                    error={error}
                    isLoading={loading}
                  />
                </div>
              </div>
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default ListPetugas;
