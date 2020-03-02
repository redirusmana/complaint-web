import React from "react";
import { connect } from "react-redux";
// import get from "lodash/get";
import Popover from "antd/lib/popover";
import "antd/lib/drawer/style/index.css";
import "antd/lib/popover/style/index.css";
import { Link } from "react-router-dom";
// import logo from "../../../assets/images/bootstrap.png";
import BoardMenu from "../../Kanban/Assists/BoardMenu";
import ProfileMenu from "../../Kanban/Assists/ProfileMenu";
import AllNotification from "../../Kanban/Assists/AllNotification";
import Avatar from "../../../provider/Display/Avatar";
import { assetsApiUrl } from "../../../provider/Tools/general";
import { AUTH_SET_LOGOUT, removeToken } from "../../Auth/action";
import api from "../../../provider/Tools/api";
import "../Style/style.css";
import "../../style/style.css";

class PageProfileNavbar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { dataSourcesUser: {}, loading: false };
  }

  componentDidMount() {
    this.getProfileInfo();
  }

  getProfileInfo = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        this._requestSource = api.generateCancelToken();
        api
          .get(`/api/profile`, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              dataSourcesUser: data,
              loading: false
            });
          })
          .catch(error => console.log(error));
      }
    );
  };
  handleLogout = () => {
    api.unsetToken();
    removeToken();
    this.props.setLogout();
  };
  render() {
    const { dataSourcesUser } = this.state;
    const { user, ...restProps } = this.props;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-sm navbar-light bg-primary">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item py-0 ">
                <Link
                  to="/user"
                  className="btn btn-sm font-weight-bold btn-outline-light"
                >
                  <i className="icofont-home" />
                </Link>
              </li>
              <li className="nav-item py-0 ">
                <Popover
                  title={<b>List Boards</b>}
                  trigger="click"
                  content={<BoardMenu {...dataSourcesUser} {...restProps} />}
                  overlayClassName="lg popover-no-padding popover-noarrow"
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                  >
                    BOARD
                  </button>
                </Popover>
              </li>
            </ul>
            <ul className="navbar-nav m-auto">
              <li className="nav-item py-0 ">
                <b className="text-center font-weight-bold text-white">
                  Papanku
                </b>
                {/* <img src={logo} width="30" height="30" alt="" /> */}
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item py-0">
                <Popover
                  title="Notification"
                  trigger="click"
                  content={<AllNotification {...dataSourcesUser.data} />}
                  overlayClassName="xxl popover-noarrow popover-no-padding-right"
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                  >
                    <i className="icofont-alarm" />
                  </button>
                </Popover>
              </li>
              <li className="nav-item py-0">
                <Popover
                  title={<b className="">{user.name}</b>}
                  trigger="click"
                  content={<ProfileMenu handleLogout={this.handleLogout} />}
                  overlayClassName="xl popover-no-padding popover-noarrow"
                >
                  <div>
                    <Avatar
                      name={user.name}
                      title={user.name}
                      image={
                        user.avatar_path
                          ? assetsApiUrl(user.avatar_path)
                          : undefined
                      }
                      // style={{
                      //   width: "2.0rem",
                      //   height: "2.0rem",
                      //   lineHeight: "2.0rem",
                      //   fontSize: "1rem"
                      // }}
                    />
                  </div>
                </Popover>
              </li>
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setLogout: () =>
    dispatch({
      type: AUTH_SET_LOGOUT
    })
});

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps, mapDispatchToProps)(PageProfileNavbar);
