import React from "react";
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
    // console.log(this.state);

    // const { user } = this.props;
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
        label: "Tanggal",
        dataIndex: "created_at",
        renderRowCell: ({ record }) => {
          return record ? record.created_at : " - ";
        }
      },
      {
        label: "NIK",
        dataIndex: "nik",
        renderRowCell: ({ record }) => (record.nik ? record.nik : " - ")
      },
      {
        label: "Nama Pengadu",
        dataIndex: "name",
        renderRowCell: ({ record }) => {
          const { user } = record;
          return user ? user.name : " - ";
        }
      },
      {
        label: "Judul Pengaduan",
        dataIndex: "title",
        renderRowCell: ({ record }) => {
          return record ? record.title : " - ";
        }
      },
      {
        label: "Foto",
        dataIndex: "image",
        renderRowCell: ({ record }) => (record.image ? record.image : " - ")
      },
      // {
      //   label: "Isi Laporan",
      //   dataIndex: "report",
      //   renderRowCell: ({ record }) => (record.report ? record.report : " - ")
      // },
      {
        label: "Status",
        dataIndex: "status",
        renderRowCell: ({ record }) => {
          return record ? record.status : " - ";
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
