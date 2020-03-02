import React from "react";
import { Empty } from "antd";
// import get from 'lodash/get';
// import ListSearch from "./ListSearch";
import get from "lodash/get";
import LoadingCard from "../../../provider/Display/LoadingCard";
import popConfirm from "../../../provider/Display/popConfirm";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";
import Avatar from "../../../provider/Display/Avatar";
import { assetsApiUrl } from "../../../provider/Tools/general";
import { apiAcceptFriend, apiDeclineFriend } from "../action";

class ListFriends extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      dataSources: {},
      loading: false
    };
  }

  componentDidMount() {
    this.getFriendsRequest();
  }

  getFriendsRequest = () => {
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
              dataSources: data.data,
              loading: false
            });
          })
          .catch(error => console.log(error));
      }
    );
  };

  onLoadChange = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  onAccept = async id => {
    try {
      this.onLoadChange(true);
      this._requestSource = api.generateCancelToken();
      const response = await apiAcceptFriend(
        `/api/friend/request/accept/${id}`,
        this._requestSource.token
      );
      const { data } = response;

      if (response.status === 200) {
        alertFloat({
          type: "success",
          content: data.message
        });
        this.setState({
          dataSources: data.data,
          loading: false
        });
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
      alertFloat({
        type: "error",
        content: error
      });
    }
    this.onLoadChange(false);
  };

  onDecline = id => {
    popConfirm({
      title: `Are you sure to cancel Friend Request?`,
      message: "Friend Request will deleted on List Request Friend",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this.onLoadChange(true);
          this._requestSource = api.generateCancelToken();
          const response = await apiDeclineFriend(
            `/api/friend/request/delete/${id}`,
            this._requestSource.token
          );
          const { data } = response;

          if (response.status === 200) {
            alertFloat({
              type: "success",
              content: data.message
            });
            this.setState({
              dataSources: data.data,
              loading: false
            });
          }
        } catch (e) {
          const error = axiosError(e);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
          alertFloat({
            type: "error",
            content: error
          });
        }
        this.onLoadChange(false);
      }
    });
  };

  onCancelAdd = id => {
    popConfirm({
      title: `Are you sure to cancel Request Friend?`,
      message: "Request Friend will deleted on List Request Friend",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this.onLoadChange(true);
          this._requestSource = api.generateCancelToken();
          const response = await apiDeclineFriend(
            `/api/friend/request/delete/${id}`,
            this._requestSource.token
          );
          const { data } = response;

          if (response.status === 200) {
            alertFloat({
              type: "success",
              content: data.message
            });
            this.setState({
              dataSources: data.data,
              loading: false
            });
          }
        } catch (e) {
          const error = axiosError(e);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
          alertFloat({
            type: "error",
            content: error
          });
        }
        this.onLoadChange(false);
      }
    });
  };

  render() {
    const { dataSources, loading } = this.state;
    const TitlelistFriendsRequest = (
      <React.Fragment>
        <h4 className="pl-3">
          <i className="icofont-users"></i> List Friends Request
        </h4>
      </React.Fragment>
    );
    const listFriendsRequest =
      Array.isArray(get(dataSources, "friend_requests")) &&
      get(dataSources, "friend_requests").length > 0 ? (
        get(dataSources, "friend_requests").map(result => (
          <React.Fragment key={`list-friend-request-${result.id}`}>
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <Avatar
                      name={get(result, "requester.name")}
                      image={
                        get(result, "requester.avatar_path")
                          ? assetsApiUrl(get(result, "requester.avatar_path"))
                          : undefined
                      }
                      size="xxxl"
                      avatarClass="avatar-link mb-1"
                    />
                    <h4 className="card-title text-center pt-2">
                      <b className="text-dark">
                        {get(result, "requester.name")}
                      </b>
                      <br />
                      {get(result, "respondent.email")}
                    </h4>
                    <button
                      onClick={() => this.onAccept(result.id)}
                      type="button"
                      className="btn rounded-pill btn-primary mr-1" //primary
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => this.onDecline(result.id)}
                      type="button"
                      className="btn rounded-pill btn-danger ml-1" //primary
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>
          <div className="col-lg-24 text-center">
            <Empty description={"Request Friend Not Found"} />
          </div>
        </React.Fragment>
      );
    const TitlelistRequestFriend = (
      <React.Fragment>
        <h4 className="pl-3">
          <i className="icofont-users"></i> List Requested Friend
        </h4>
      </React.Fragment>
    );

    const listRequestFriend =
      Array.isArray(get(dataSources, "requested_friends")) &&
      get(dataSources, "requested_friends").length > 0 ? (
        get(dataSources, "requested_friends").map(result => (
          <React.Fragment key={`list-request-friend-${result.id}`}>
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <Avatar
                      name={get(result, "respondent.name")}
                      image={
                        get(result, "respondent.avatar_path")
                          ? assetsApiUrl(get(result, "respondent.avatar_path"))
                          : undefined
                      }
                      size="xxxl"
                      avatarClass="avatar-link mb-1"
                    />
                    <h4 className="card-title text-center pt-2">
                      {get(result, "respondent.name")}<br/>
                      {get(result, "respondent.email")}
                    </h4>
                    <button
                      type="button"
                      onClick={() => this.onCancelAdd(result.id)}
                      className="btn rounded-pill btn-danger mr-1" //warning
                    >
                      Cancel Add Friend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>
          <div className="col-lg-24 text-center">
            <Empty description={"Requested to Friend Not Found"} />
          </div>
        </React.Fragment>
      );

    return (
      <React.Fragment>
        {/* <ListSearch /> */}
        <div className="col-lg-24 ">
          {!loading && !!listFriendsRequest ? TitlelistFriendsRequest : ""}
          <div className="row mb-3">
            {loading ? <LoadingCard /> : listFriendsRequest}
          </div>
          <hr />
          {!loading && !!listRequestFriend ? TitlelistRequestFriend : ""}
          <div className="row mb-3">
            {loading ? <LoadingCard /> : listRequestFriend}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ListFriends;
