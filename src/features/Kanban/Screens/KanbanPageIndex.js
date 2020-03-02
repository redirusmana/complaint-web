import React from "react";
import { connect } from "react-redux";
import KanbanPage from "./KanbanPage";
import NavbarKanbanPage from "./NavbarKanbanPage";
import LoadingPage from "../../../provider/Display/LoadingPage";
import api from "../../../provider/Tools/api";
import { AUTH_SET_LOGOUT, removeToken } from "../../Auth/action";
import "../Style/style.css";
import "../../style/style.css";

class KanbanPageIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceUser: {},
      dataSource: {}
    };
  }

  componentDidMount() {
    this.getBoardInfo();
  }

  getBoardInfo = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        const { match } = this.props;
        const ROUTE_API = `api/board/${match.params.id}`;
        this._requestSource = api.generateCancelToken();
        api
          .get(ROUTE_API, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              dataSource: data,
              loading: false
            });
          })
          .catch(error => console.log(error));

        this._requestSource = api.generateCancelToken();
        api
          .get(`/api/profile`, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              dataSourceUser: data,
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
    const { dataSource, dataSourceUser, loading } = this.state;
    if (loading) {
      return <LoadingPage />;
    }
    // const {user} = this.props;
    return (
      <React.Fragment>
        <div className="projectable">
          <div className="projectable-header">
            <NavbarKanbanPage
              dataSources={dataSource}
              dataSourcesUser={dataSourceUser}
              handleLogout={this.handleLogout}
              {...this.props}
            />
          </div>
          <div className="projectable-body">
            <KanbanPage {...this.props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(KanbanPageIndex);
