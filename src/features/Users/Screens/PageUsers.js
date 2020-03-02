import React from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import ListFriends from "../Components/ListFriends";
import ListBoard from "../Components/ListBoard";
import ListActivity from "../Components/ListActivity";
import "../Style/style.css";

class PageUsers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource, match } = this.props;
    return (
      <React.Fragment>
        <div className="fb-profile-block-menu mb-3">
          <div className="row block-menu">
            <div className="col-lg-6 px-0 navs">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to="/user/friend"
                exact
              >
                <i className="icofont-home text-primary" />
              </NavLink>
            </div>
            <div className="col-lg-6 px-0 navs">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to={`/users/${match.params.email}`}
                exact
              >
                Board
              </NavLink>
            </div>
            <div className="col-lg-6 px-0 navs">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to={`/users/${match.params.email}/activity`}
                exact
              >
                Activity
              </NavLink>
            </div>
            <div className="col-lg-6 px-0 navs ">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to={`/users/${match.params.email}/friend`}
              >
                Friend
              </NavLink>
            </div>
          </div>
        </div>
        <div className="row">
          <Switch>
            <Route
              path={`/users/${match.params.email}`}
              exact
              render={routeProps => (
                <ListBoard {...routeProps} dataSource={dataSource} />
              )}
            />
            <Route
              path={`/users/${match.params.email}/activity`}
              exact
              render={routeProps => (
                <ListActivity {...routeProps} email={match.params.email} />
              )}
            />
            <Route
              path={`/users/${match.params.email}/friend`}
              exact
              render={routeProps => (
                <ListFriends {...routeProps} dataSource={dataSource} />
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default PageUsers;
