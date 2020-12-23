import React from "react";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import LoadingPage from "./provider/Display/LoadingPage";
import PageLogin from "./features/Auth/Screens/PageLogin";
import PageRegister from "./features/Auth/Screens/PageRegister";
import PageDashboard from "./features/Dashboard/Screens/PageDashboard";
import PagePetugas from "./features/Petugas/Screens/PagePetugas";
import PageMasyarakat from "./features/Masyarakat/Screens/PageMasyarakat";
import PagePengaduan from "./features/Complaint/Screens/PagePengaduan";
import RoutePrivate from "./features/Auth/Components/RoutePrivate";
import { getSavedToken, AUTH_SET_LOGIN } from "./features/Auth/action";
import { axiosError } from "./provider/Tools/converter";
import api, { AXIOS_CANCEL_MESSAGE } from "./provider/Tools/api";
import { doVerify } from "./AppAction";
import RouteGuard from "./features/Auth/Components/RouteGuard";

class App extends React.PureComponent {
  state = {
    loading: true
  };

  componentDidMount() {
    this.verifyUser();
  }

  verifyUser = async () => {
    try {
      this._requestSource = api.generateCancelToken();

      const token = getSavedToken();
      const type = "Bearer";

      if (token) {
        api.setToken(type, token);

        const response = await doVerify(this._requestSource.token);

        this.props.setLogin({
          user: response.data.response,
          token,
          type
        });
      }

      this.setState({
        loading: false
      });
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
      this.setState({
        loading: false
      });
    }
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return <LoadingPage />;
    }

    return (
      <React.Fragment>
        <Switch>
          <RouteGuard path="/login" exact component={PageLogin} />
          <RouteGuard path="/register" exact component={PageRegister} />

          <RoutePrivate path="/dashboard" component={PageDashboard} />
          <RoutePrivate path="/master-data/petugas" component={PagePetugas} />
          <RoutePrivate
            path="/master-data/pengaduan"
            component={PagePengaduan}
          />
          <RoutePrivate
            path="/master-data/masyarakat"
            component={PageMasyarakat}
          />
          {/* <RoutePrivate path="/profile" component={PageProfile} /> */}
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  token: store.auth.token,
  user: store.auth.user
});

const mapDispatchToProps = dispatch => ({
  setLogin: payload =>
    dispatch({
      type: AUTH_SET_LOGIN,
      payload
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
