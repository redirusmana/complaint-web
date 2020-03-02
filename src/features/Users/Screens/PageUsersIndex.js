import React from "react";
import api from "../../../provider/Tools/api";
import LoadingPage from "../../../provider/Display/LoadingPage";
import PageUsersInfo from "./PageUsersInfo";
import PageUsers from "./PageUsers";
import "../Style/style.css";

class PageUsersIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { dataSources: {} };
  }

  componentDidMount() {
    this.getUsersInfo();
  }

  getUsersInfo = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        const { match } = this.props;
        this._requestSource = api.generateCancelToken();
        api
          .get(`/api/${match.params.email}`, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              dataSources: data.data,
              loading: false
            });
          })
          .catch(error => console.log(error));
      }
    );
  };

  render() {
    const { dataSources, loading } = this.state;

    if (loading) {
      return <LoadingPage />;
    }

    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row p-3">
            <div className="col-lg-6">
              <PageUsersInfo dataSource={dataSources} />
            </div>
            <div className="col-lg-18">
              <PageUsers dataSource={dataSources} {...this.props} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default PageUsersIndex;
