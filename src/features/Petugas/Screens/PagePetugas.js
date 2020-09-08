import React from "react";
import { Link, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { AUTH_SET_LOGOUT, removeToken } from "../../Auth/action";
import api from "../../../provider/Tools/api";
import {
  PAGE_OFFICERS_CREATE,
  PAGE_OFFICERS_HOME
  // PAGE_OFFICERS_EDIT
} from "../action";
import FormPetugas from "../Component/FormPetugas";
import ListPetugas from "../Component/ListPetugas";

class PagePetugas extends React.PureComponent {
  handleLogout = () => {
    api.unsetToken();
    removeToken();
    this.props.setLogout();
  };
  render() {
    return (
      <React.Fragment>
        <div className="jumbotron text-center mb-0 py-5 bg-primary">
          <h1 className="display-5 text-white">E - Complaint</h1>
          <p className="lead text-white">
            Sistem Pengaduan Keluhan Layanan Masyarakat Berbasis Online
          </p>
        </div>

        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item ">
                <Link
                  to="/login"
                  className="btn btn-md font-weight-bold btn-link text-dark"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn btn-md font-weight-bold btn-link text-dark"
                    tag="button"
                  >
                    Master Data
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow">
                    <DropdownItem
                      tag={Link}
                      to={"/master-data/petugas"}
                      key={"/master-data/petugas"}
                    >
                      Data Petugas
                    </DropdownItem>
                    <DropdownItem
                      tag={Link}
                      to={"/master-data/pengaduan"}
                      key={"/master-data/pengaduan"}
                    >
                      Data Pengaduan
                    </DropdownItem>
                    <DropdownItem
                      tag={Link}
                      to={"/master-data/masyarakat"}
                      key={"/master-data/masyarakat"}
                    >
                      Data Masyarakat
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
            <div
              className="navbar-brand ml-auto"
              style={{ fontSize: "14px", color: "white" }}
            >
              <UncontrolledDropdown>
                <DropdownToggle
                  className="btn btn-md font-weight-bold btn-link text-dark"
                  tag="button"
                >
                  Username
                </DropdownToggle>
                <DropdownMenu right className="dropdown-menu-arrow">
                  <DropdownItem
                    tag="button"
                    onClick={() => this.handleLogout()}
                  >
                    Edit Profile
                  </DropdownItem>
                  <DropdownItem tag={Link} to={"/login"} key={"/login"}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </nav>

        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-24">
              <Switch>
                <Route path={PAGE_OFFICERS_HOME} component={ListPetugas} />
                <Route
                  path={PAGE_OFFICERS_CREATE}
                  exact
                  component={FormPetugas}
                />
                {/* <Route
                  path={PAGE_OFFICERS_EDIT}
                  exact
                  component={FormPetugas}
                /> */}
              </Switch>
            </div>
          </div>
        </div>

        {/* <div className="container-fluid bg-primary">
          <div className="row text-white">
            <div className="col-lg-24">
              <p className="text-center m-2">
                Copyright &copy; 2019. All rights reserved.
              </p>
            </div>
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});

const mapDispatchToProps = dispatch => ({
  setLogout: () =>
    dispatch({
      type: AUTH_SET_LOGOUT
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(PagePetugas);
