import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const RoutePrivate = ({ user, token, path, exact, component: Component }) => {
  return (
    <Route
      path={path}
      exact={exact}
      render={routeProps => {
        if (user && token) {
          return <Component {...routeProps} />;
        }

        return <Redirect to="/login" />;
      }}
    />
  );
};

const mapStateToProps = store => ({
  user: store.auth.user,
  token: store.auth.token
});

export default connect(mapStateToProps)(RoutePrivate);
