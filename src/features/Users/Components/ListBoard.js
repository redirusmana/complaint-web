import React from "react";
import { Empty } from "antd";
// import { Link } from "react-router-dom";
import get from "lodash/get";
import { dateFromNowString } from "../../../provider/Tools/converter";
import "../Style/style.css";

class ListBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource } = this.props;

    const TitleListBoard = (
      <React.Fragment>
        <h4 className="pl-3">
          <i className="icofont-page"></i> List Board
        </h4>
      </React.Fragment>
    );
    const listBoards =
      Array.isArray(get(dataSource, "boards")) &&
      get(dataSource, "boards").length > 0 ? (
        get(dataSource, "boards").map(result => (
          <React.Fragment key={`list-board-${result.id}`}>
            {result.visibility === "public" && (
              <div className="col-lg-8 mb-3">
                <div className="card ">
                  <div className="card-body">
                    <p className="card-title">{result.title}</p>
                    <p className="card-text text-right">
                      <small className="text-muted">
                        last Updated {dateFromNowString(result.created_at)}
                      </small>
                    </p>
                  </div>
                  <div className="card-footer text-left py-2">
                    {result.created_by}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>
          <div className="col-lg-24 text-center ">
            <h4 className="text-center font-weight-bold pt-5">
              <Empty description={"Board is Not Found"} />
            </h4>
          </div>
        </React.Fragment>
      );

    return (
      <React.Fragment>
        <div className="col-lg-24 ">
          {TitleListBoard}
          <div className="row mb-3">
            <React.Fragment>
              {/* <div className="card"> */}
              {/* <div className="card-body"> */}
              {listBoards}
              {/* </div> */}
              {/* </div> */}
            </React.Fragment>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ListBoard;
