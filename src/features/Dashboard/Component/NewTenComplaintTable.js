import React from "react";
import get from "lodash/get";
import Table from "../../../provider/Table/TableServer";
import { getSortObject } from "../../../provider/Tools/converter";
import PageHeader from "../../../provider/Display/PageHeader";
import FetchResource from "../../../provider/Tools/FetchResource";
import { apiOfficersGet } from "../action";

class NewTenComplaintTable extends React.Component {
  configFilter = [{ type: "select", title: "Jenis Kelamin", key: "gender" }];

  constructor(props) {
    super(props);

    this.state = {
      sortKey: "created_at",
      sortValue: 0,
      sortOrder: "asc",

      page: 1,
      totalPaginate: 10,
      perPage: 10
    };
  }

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

  render() {
    const {
      page,
      perPage,
      search,
      increment,
      totalPaginate,
      queries,
      sortKey,
      sortOrder,
      sortValue
    } = this.state;
    const columns = [
      {
        label: "NIK",
        dataIndex: "nik",
        renderRowCell: ({ record }) => (record.nik ? record.nik : " - ")
      },
      {
        label: "Nama Pengadu",
        dataIndex: "name",
        renderRowCell: ({ record }) => {
          const { person } = record;
          return person.user ? get(person, "user.name") : "-";
        }
      },
      {
        label: "Tanggal Pengadu",
        dataIndex: "created_at",
        renderRowCell: ({ record }) => {
          return record ? record.created_at : " - ";
        }
      },
      {
        label: "Title",
        dataIndex: "title",
        renderRowCell: ({ record }) => {
          return record ? record.title : " - ";
        }
      },
      {
        label: "Complaint",
        dataIndex: "complaint",
        style: {
          whiteSpace: "normal",
          minWidth: 400,
          maxWidth: 400
        },
        renderRowCell: ({ record }) =>
          record.complaint ? record.complaint : " - "
      },

      {
        label: "Status",
        dataIndex: "status",
        renderRowCell: ({ record }) => {
          let badge = null;
          let badges = null;
          if (record.status === "pending") {
            badge = "warning";
            badges = "Pending";
          } else if (record.status === "progress") {
            badge = "primary";
            badges = "Progress";
          } else {
            badge = "success";
            badges = "Done";
          }
          return (
            <span
              className={`w-100 badge badge-${badge}`}
              style={{ fontSize: "12px", fontWeight: "bold" }}
            >
              {record.status ? badges : " - "}
            </span>
          );
        }
      }
    ];

    return (
      <React.Fragment>
        <PageHeader title="10 Pengaduan Terbaru" showWrapper />
        <FetchResource
          key={`table-10-pengaduan-terbaru-${increment}`}
          dataUrl={apiOfficersGet}
          queryParams={{
            ...queries,
            page,
            perPage,
            totalPaginate,
            search,
            sortKey,
            sortOrder,
            paginate: false
          }}
          render={({ dataSource, error, loading }) => {
            return (
              <div className="card mt-2">
                <div className="card-body p-1">
                  <Table
                    name="list-new-ten-complaint-table"
                    columns={columns}
                    dataSource={dataSource.data}
                    showRowNumber
                    pageControl={false}
                    sorting
                    onSortChange={this.handleSortChange}
                    initialSortKey={sortKey}
                    initialSortValue={sortValue}
                    search={false}
                    error={error}
                    showPagination={false}
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

export default NewTenComplaintTable;
