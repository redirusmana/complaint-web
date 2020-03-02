import React from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import Drawer from "antd/lib/drawer";
import Popover from "antd/lib/popover";
import "antd/lib/drawer/style/index.css";
import "antd/lib/popover/style/index.css";
import { Link } from "react-router-dom";
// import logo from "../../../assets/images/bootstrap.png";
// import TaskList from "../Components/TaskList";
import ProfileMember from "../Assists/ProfileMember";
import Modal from "../../../provider/Display/Modal";
import FormInviteFriend from "../Assists/FormInviteFriend";
import ListMemberFriend from "../Assists/ListMemberFriend";
import BoardMenu from "../Assists/BoardMenu";
import ProfileMenu from "../Assists/ProfileMenu";
import AllActivity from "../Assists/AllActivity";
import AllNotification from "../Assists/AllNotification";
import Avatar from "../../../provider/Display/Avatar";
import { assetsApiUrl } from "../../../provider/Tools/general";
import "../Style/style.css";
import "../../style/style.css";

class NavbarKanbanPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isVisible: false, isDrawer: false };
  }

  handleDrawer = () => {
    this.setState({
      isDrawer: true
    });
  };

  handleModal = () => {
    this.setState({
      isVisible: true
    });
  };

  handleClose = () => {
    this.setState({
      isVisible: false,
      isDrawer: false
    });
  };

  // handleExitBoard = () => {

  // };
  render() {
    const { isVisible, isDrawer } = this.state;
    const {
      dataSourcesUser,
      handleLogout,
      dataSources,
      user,
      ...restProps
    } = this.props;

    const mappedMemberNav =
      Array.isArray(get(dataSources, "members")) &&
      get(dataSources, "members").length > 0
        ? get(dataSources, "members")
            .slice(0, 5)
            .map(result => (
              <React.Fragment
                key={`list-mapped-member-nav-${result.id}-${result.user_id}`}
              >
                <Popover
                  trigger="click"
                  content={
                    <ProfileMember results={result} idBoard={dataSources.id} />
                  }
                  placement="bottomLeft"
                  overlayClassName="xl popover-no-padding"
                >
                  <div>
                    <Avatar
                      name={get(result, "user.name")}
                      image={
                        get(result, "user.avatar_path")
                          ? assetsApiUrl(get(result, "user.avatar_path"))
                          : undefined
                      }
                      title={get(result, "user.name")}
                      size="sm"
                    />
                  </div>
                </Popover>
              </React.Fragment>
            ))
        : [];
    const listMemberLength =
      Array.isArray(get(dataSources, "members")) &&
      get(dataSources, "members").length > 0
        ? get(dataSources, "members").length > 5 && (
            <Avatar size="sm" name={get(dataSources, "members").length - 5} />
          )
        : null;

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
                  content={<ProfileMenu handleLogout={handleLogout} />}
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

        <nav className="navbar navbar-expand-sm navbar-light">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item py-0 font-weight-bold">
                {dataSources.title}
              </li>
              <li className="nav-item py-0 font-weight-bold text-white">
                {mappedMemberNav}

                <Popover
                  title="Members"
                  trigger="click"
                  content={<ListMemberFriend listMemberBoard={dataSources} />}
                  placement="bottomLeft"
                  overlayClassName="lg"
                >
                  <div>{listMemberLength}</div>
                </Popover>
                <button
                  type="button"
                  onClick={() => this.handleModal("invite")}
                  className="btn btn-sm btn-outline-primary mx-1"
                >
                  Invite
                </button>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              {/* <li className="nav-item font-weight-bold">
                <div> Total Card : 2</div>
              </li>
              <li className="nav-item font-weight-bold">
                <div> Total Task : 14</div>
              </li>
              <li className="nav-item font-weight-bold">
                <div>Created At : 13/13/2013</div>
              </li>
              <li className="nav-item font-weight-bold">
                <Popover
                  title="Members"
                  trigger="click"
                  content={<ListMemberFriend />}
                  placement="bottomLeft"
                  overlayClassName="lg"
                >
                  <div>
                    Created By : <Avatar name="R R" size="sm" /> Redi Rusmana
                  </div>
                </Popover>
              </li> */}
              <li className="nav-item py-0 font-weight-bold">
                <button
                  type="button"
                  // onClick={() => this.handleExitBoard()}
                  className="btn btn-sm btn-outline-primary"
                >
                  Exit Board <i className="icofont-exit"/>
                </button>
              </li>
              <li className="nav-item py-0 font-weight-bold">
                <button
                  type="button"
                  onClick={() => this.handleDrawer()}
                  className="btn btn-sm btn-outline-primary"
                >
                  All Activity
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <Modal
          title="Rename Board"
          visible={isVisible}
          size="medium"
          handleBack={this.handleClose}
        >
          <div className="container">
            <FormInviteFriend
              idBoard={dataSources.id}
              handleClose={this.handleClose}
            />
          </div>
        </Modal>
        <Drawer
          title={"All Activity"}
          placement={"right"}
          onClose={this.handleClose}
          visible={isDrawer}
          width={400}
          mask={false}
          className="drawer-sticky-header"
          closable
          // maskClosable={false}
          // afterVisibleChange={}
        >
          <AllActivity idBoard={dataSources.id} />
        </Drawer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps)(NavbarKanbanPage);
