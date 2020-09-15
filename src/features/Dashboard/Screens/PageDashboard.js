import React from "react";
import { connect } from "react-redux";
import { Link, Switch, Route } from "react-router-dom";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { AUTH_SET_LOGOUT, removeToken } from "../../Auth/action";
import { PAGE_DASHBOARD_PREFIX } from "../action";
import api from "../../../provider/Tools/api";
import Alert from "../../../provider/Display/Alert";
import NewTenComplaintTable from "../Component/NewTenComplaintTable";

class PageDashboard extends React.PureComponent {
  handleLogout = () => {
    api.unsetToken();
    removeToken();
    this.props.setLogout();
  };
  roleGenFunc = ({ userRole }) => {
    if (userRole === 1) {
      return "Petugas";
    }
    if (userRole === 2) {
      return "Masyarakat";
    }
    return "Admin";
  };
  render() {
    const { location, user } = this.props;

    const dashboardStyleNav =
      location.pathname === "/dashboard" ? "text-primary" : "text-dark";
    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid text-center mb-0 py-5 bg-primary">
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
                  to="/dashboard"
                  className={`btn btn-md font-weight-bold btn-link ${dashboardStyleNav}`}
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
                  {user.name || " - "}
                </DropdownToggle>
                <DropdownMenu right className="dropdown-menu-arrow">
                  {/* <DropdownItem tag={Link} to={"/profle"} key={"/profle"}>
                    Edit Profile
                  </DropdownItem> */}
                  <DropdownItem
                    tag="button"
                    key="logout"
                    onClick={() => {
                      this.handleLogout();
                    }}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </nav>

        <div className="container mt-5">
          <div className="flex text-center font-weight-bold mb-3">
            <Alert
              type="info"
              closable={false}
              // message="Anda telah login sebagai"
              message={
                <div>
                  Anda telah Login sebagai{" "}
                  <b>
                    {this.roleGenFunc({
                      userRole: user.role
                    })}
                  </b>
                </div>
              }
              showIcon={false}
            />
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="card text-dark bg-white mb-3">
                <div className="card-body">
                  <h5 className="card-text text-center font-weight-bold">
                    Petugas (?)
                  </h5>
                  <p className="card-text text-center">Jumlah Petugas</p>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card text-dark bg-white mb-3">
                <div className="card-body">
                  <h5 className="card-text text-center font-weight-bold">
                    Pengaduan (?)
                  </h5>
                  <p className="card-text text-center">
                    Jumlah Pengaduan yang diajukan masyarakat
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card text-dark bg-white mb-3">
                <div className="card-body">
                  <h5 className="card-text text-center font-weight-bold">
                    Masyarakat (?)
                  </h5>
                  <p className="card-text text-center">Jumlah Masyarakat</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <p className="card-text text-center">
                    <b>(?) Pengaduan</b> menunggu konfirmasi
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <p className="card-text text-center">
                    <b>(?) Pengaduan</b> telah Selesai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-24">
              <Switch>
                <Route
                  path={PAGE_DASHBOARD_PREFIX}
                  component={NewTenComplaintTable}
                />
              </Switch>
            </div>
          </div>
        </div>

        <div className="container-fluid bg-white">
          <div className="row text-dark ">
            <div className="col-lg-24">
              <p className="text-center pt-3">
                Copyright &copy; 2019. All rights reserved.
              </p>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PageDashboard);
