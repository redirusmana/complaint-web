import React from "react";
import Avatar from "../../../provider/Display/Avatar";
import { assetsApiUrl } from "../../../provider/Tools/general";
import "../Style/style.css";

class PageUsersInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource } = this.props;

    return (
      <React.Fragment>
        <div className="card mb-3">
          <React.Fragment>
            <div className="card-header mx-auto my-2">
              <Avatar
                avatarClass="avatar-link avatar-huge "
                image={
                  dataSource.avatar_path
                    ? assetsApiUrl(dataSource.avatar_path)
                    : undefined
                }
                size="md"
                name={dataSource.name || ""}
                title={dataSource.name || ""}
              />
            </div>
            <div className="card-body">
              <h3 className="text-center">{`${dataSource.name}` || " - "}</h3>
              <hr />
              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  Username
                </div>
                <div className="ml-2">{dataSource.username || " - "}</div>
              </div>
              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  Gender
                </div>
                <div className="ml-2">{dataSource.gender || " - "}</div>
              </div>
              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  Date of Birth
                </div>
                <div className="ml-2">{dataSource.birth || " - "}</div>
              </div>
              <hr />
              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  {dataSource.email || " - "}
                </div>
              </div>
              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  {dataSource.phone_number
                    ? `+62 ${dataSource.phone_number}`
                    : " - "}
                </div>
              </div>
            </div>
          </React.Fragment>
        </div>
      </React.Fragment>
    );
  }
}

export default PageUsersInfo;
