import React from "react";
import { connect } from "react-redux";
import { Route, Switch, NavLink } from "react-router-dom";
import ListFriends from "../Components/ListFriends";
import ListFriendsRequest from "../Components/ListFriendsRequest";
import ListBoards from "../Components/ListBoards";
import ListActivity from "../Components/ListActivity";
import "../Style/style.css";

class PageProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="fb-profile-block-menu mb-3">
          <div className="row block-menu">
            {1 === 2 && (
              <div className="col-lg-6 px-0 navs">
                <NavLink
                  className="text-primary h-100 d-block"
                  activeClassName="text-primary active"
                  to="/user"
                  exact
                >
                  <i className="icofont-home text-primary" />
                </NavLink>
              </div>
            )}
            <div className="col-lg-6 px-0 navs">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to="/user"
                exact
              >
                Board
              </NavLink>
            </div>
            <div className="col-lg-6 px-0 navs">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to="/user/activity"
                exact
              >
                Activity
              </NavLink>
            </div>
            <div className="col-lg-6 px-0 navs ">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to="/user/friend"
              >
                Friend
              </NavLink>
            </div>
            <div className="col-lg-6 px-0 navs ">
              <NavLink
                className="text-primary h-100 d-block"
                activeClassName="text-primary active"
                to="/user/request-friend"
              >
                Friend Request
              </NavLink>
            </div>
          </div>
        </div>
        <div className="row">
          <Switch>
            <Route
              path="/user"
              exact
              render={routeProps => <ListBoards {...routeProps} />}
            />
            <Route
              path="/user/activity"
              exact
              render={routeProps => <ListActivity {...routeProps} />}
            />
            <Route
              path="/user/friend"
              render={routeProps => <ListFriends {...routeProps} />}
            />
            <Route
              path="/user/request-friend"
              render={routeProps => <ListFriendsRequest {...routeProps} />}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});
export default connect(mapStateToProps)(PageProfile);
