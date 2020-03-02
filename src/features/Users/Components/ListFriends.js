import React from "react";
import { connect } from "react-redux";
import Avatar from "../../../provider/Display/Avatar";
import { Link } from "react-router-dom";
import { Empty } from "antd";
import get from "lodash/get";
import { assetsApiUrl } from "../../../provider/Tools/general";

class ListFriends extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource } = this.props;

    const TitleListFriend = (
      <React.Fragment>
        <h4 className="pl-3">
          <i className="icofont-page"></i> List Friend
        </h4>
      </React.Fragment>
    );
    const listFriends =
      Array.isArray(get(dataSource, "friends")) &&
      get(dataSource, "friends").length > 0 ? (
        get(dataSource, "friends").map(result => {
          const { user } = this.props;
          return (
            <React.Fragment key={`list-friend-${result.id}`}>
              <div className="col-lg-8 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center">
                      <Avatar
                        name={result.name}
                        image={
                          result.avatar_path
                            ? assetsApiUrl(result.avatar_path)
                            : undefined
                        }
                        size="xxxl"
                        avatarClass="avatar-link mb-1"
                      />
                      <h4 className="card-title text-center pt-2">
                        <b className="text-dark">{result.name}</b>
                        <br />
                        {result.username}
                      </h4>
                      {user.email !== result.email && (
                        <Link
                          to={`/users/${result.email}`}
                          type="button"
                          className="btn rounded-pill btn-primary mr-1"
                        >
                          <i className="font-weight-normal icofont-info-circle" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
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
          {TitleListFriend}
          <div className="row mb-3">
            <React.Fragment>
              {/* <div className="card"> */}
              {/* <div className="card-body"> */}
              {listFriends}
              {/* </div> */}
              {/* </div> */}
            </React.Fragment>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps)(ListFriends);
