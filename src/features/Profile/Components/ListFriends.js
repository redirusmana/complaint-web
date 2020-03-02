import React from "react";
import { Link } from "react-router-dom";
import ListSearch from "./ListSearch";
import Modal from "../../../provider/Display/Modal";
import Avatar from "../../../provider/Display/Avatar";
import get from "lodash/get";
import LoadingCard from "../../../provider/Display/LoadingCard";
import popConfirm from "../../../provider/Display/popConfirm";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";
import FormAddFriend from "../Modal/FormAddFriend";
import { apiDeleteFriend } from "../action";
import { assetsApiUrl } from "../../../provider/Tools/general";

class ListFriends extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      search: ""
    };
  }

  componentDidMount() {
    this.getFriends();
  }

  getFriends = () => {
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

  handleModal = () => {
    this.setState({
      isVisible: true
    });
  };

  handleClose = () => {
    this.setState({
      isVisible: false
    });
  };

  onLoadChange = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  onDeleteFriend = pivot => {
    const { memberable_type, ...newValues } = pivot;
    popConfirm({
      title: `Are you sure to remove this Friend?`,
      message: "Friend will deleted on List Friend",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this.onLoadChange(true);
          this._requestSource = api.generateCancelToken();
          const response = await apiDeleteFriend(
            `/api/friend/delete`,
            newValues,
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
        } catch (err) {
          const error = axiosError(err);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
          alertFloat({
            type: "error",
            content: error
          });
        }
        this.onLoadChange(false);
      },
      onCancel: () => {}
    });
  };

  handleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  handleSearch = isSearch => {
    this.setState({
      search: isSearch
    });
  };

  render() {
    const { dataSources, loading, isVisible, search } = this.state;

    const filteredFriend =
      Array.isArray(get(dataSources, "friends")) &&
      get(dataSources, "friends").length > 0
        ? get(dataSources, "friends").filter(friend => {
            return (
              friend.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
            );
          })
        : [];

    const listFriends = filteredFriend.map(result => (
      <React.Fragment key={`list-friend-${result.id}`}>
        <div className="col-lg-8 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <Avatar
                  name={result.name}
                  image={
                    result.avatar_path
                      ? assetsApiUrl(result.avatar_path)
                      : undefined
                  }
                  size="xxxl"
                  avatarClass="avatar-link mb-1"
                />
                <h4 className="card-title text-center pt-2">
                  <b className="text-dark">{result.name}</b>
                  <br />
                  {result.username}
                </h4>
                <Link
                  to={`/users/${result.email}`}
                  type="button"
                  className="btn rounded-pill btn-primary mr-1"
                >
                  <i className="font-weight-normal icofont-info-circle" />
                </Link>
                <button
                  type="button"
                  onClick={() => this.onDeleteFriend(result.pivot, result.id)}
                  className="btn rounded-pill btn-danger ml-1"
                >
                  <i className="font-weight-normal icofont-bin " />
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    ));
    // : [];
    if (loading) {
      return <LoadingCard />;
    }

    return (
      <React.Fragment>
        <ListSearch placeholder="Search Friends" beginSearch={this.handleSearch} />
        {listFriends}
        <div className="col-lg-8 mb-3">
          <div className="card p-5">
            <div className="card-body ">
              <div className="text-center">
                <h4 className="text-primary ">
                  <i className="icofont-people icofont-5x" />
                  <br /> Add Friend
                </h4>
              </div>
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => this.handleModal()}
                  className="btn rounded-pill btn-primary "
                >
                  <i className="font-weight-normal icofont-plus" />
                  Friend
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Add New Friend"
          visible={isVisible}
          size="small"
          handleBack={this.handleClose}
        >
          <div className="container">
            <FormAddFriend
              handleLoading={this.handleLoading}
              handleClose={this.handleClose}
            />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ListFriends;
