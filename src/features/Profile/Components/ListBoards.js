import React from "react";
import { connect } from "react-redux";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import get from "lodash/get";
import { dateFromNowString } from "../../../provider/Tools/converter";
import LoadingCard from "../../../provider/Display/LoadingCard";
import Modal from "../../../provider/Display/Modal";
import popConfirm from "../../../provider/Display/popConfirm";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";
import FormCreateBoard from "../Modal/FormCreateBoard";
import FormEditBoard from "../Modal/FormEditBoard";
import { apiAcceptFriend, apiDeclineFriend } from "../action";
import "../Style/style.css";

class ListBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      condition: "",
      newInitialValuesEdit: {}
    };
  }

  componentDidMount() {
    this.getBoards();
  }

  getBoards = () => {
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

  handleModal = condition => {
    this.setState({
      isVisible: true,
      condition
    });
  };

  handleEdit = (condition, result) => {
    this.setState({
      isVisible: true,
      condition,
      newInitialValuesEdit: result
    });
  };

  handleClose = () => {
    this.setState({
      isVisible: false
    });
  };

  handleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  handleReplace = newDataSource => {
    this.setState({
      dataSources: newDataSource
    });
  };

  onLoadChange = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  onAccept = async (id, idBoard) => {
    try {
      this.onLoadChange(true);
      this._requestSource = api.generateCancelToken();
      const response = await apiAcceptFriend(
        `/api/board/${idBoard}/accept/${id}`,
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
      title: `Are you sure to cancel Request invited Board?`,
      message: "Board will deleted on List Board",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this.onLoadChange(true);
          this._requestSource = api.generateCancelToken();
          const response = await apiDeclineFriend(
            `/api/board/delete/${id}`,
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

  onDelete = id => {
    popConfirm({
      title: `Are you sure to cancel delete this Board?`,
      message: "Board will deleted on List Board",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this.onLoadChange(true);
          this._requestSource = api.generateCancelToken();
          const response = await apiDeclineFriend(
            `/api/board/${id}`,
            this._requestSource.token
          );
          const { data } = response;

          if (response.status === 200) {
            alertFloat({
              type: "success",
              content: data.message
            });
            this.setState(prevState => {
              const result = {
                dataSources: {
                  ...prevState.dataSources,
                  boards: data.boards
                }
              };
              return result;
            });
            this.setState({
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

  handleUpdateReplace = newBoards => {
    this.setState(prevState => {
      const result = {
        dataSources: {
          ...prevState.dataSources,
          boards: newBoards
        }
      };
      return result;
    });
  };

  render() {
    const {
      isVisible,
      dataSources,
      loading,
      condition,
      newInitialValuesEdit
    } = this.state;
    const { user } = this.props;

    const TitleListBoard = (
      <React.Fragment>
        <h4 className="pl-3">
          <i className="icofont-page"></i> List Board
        </h4>
      </React.Fragment>
    );
    const listBoards =
      Array.isArray(get(dataSources, "boards")) &&
      get(dataSources, "boards").length > 0
        ? get(dataSources, "boards").map(result => (
            <React.Fragment key={`list-board-${result.id}`}>
              <div className="col-lg-8 mb-3">
                <div className="card ">
                  <div className="card-body">
                    <div className="card-title">
                      {/* {result.title} */}
                      <div className="d-flex flex-row font-weight-normal">
                        <div
                          className="mr-auto"
                          style={{ wordBreak: "break-all" }}
                        >
                          {result.title}
                        </div>
                        <div className="ml-2">
                          {result.created_by === user.username && (
                            <button
                              onClick={() => this.handleEdit("Edit", result)}
                              type="button"
                              className="btn btn-primary btn-sm ml-1"
                            >
                              <i className="icofont-gear" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="card-text text-right">
                      <small className="text-muted">
                        last Updated {dateFromNowString(result.created_at)}
                      </small>
                    </p>
                  </div>
                  <div className="card-footer text-right py-2">
                    <Link
                      to={`/board/${result.id}`}
                      className="btn btn-sm btn-primary font-weight-bold "
                    >
                      Board
                    </Link>
                    {/* user.name */}

                    {result.created_by === user.username && (
                      <button
                        onClick={() => this.onDelete(result.id)}
                        type="button"
                        className="btn btn-sm rounded-pill btn-danger ml-1"
                      >
                        <i className="icofont-trash" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
        : [];

    const TitleInviteBoard = (
      <React.Fragment>
        <h4 className="pl-3">
          <i className="icofont-page"></i> List Invited Board
        </h4>
      </React.Fragment>
    );

    const board_invitation_request =
      Array.isArray(get(dataSources, "board_invitation_request")) &&
      get(dataSources, "board_invitation_request").length > 0 ? (
        get(dataSources, "board_invitation_request").map(result => (
          <React.Fragment
            key={`list-board-invited--request-${result.id}=${result.invitation_id}`}
          >
            <div className="col-lg-8 mb-3">
              <div className="card ">
                <div className="card-body">
                  <p className="card-title">{get(result, "board.title")}</p>
                  <p className="card-text text-right">
                    <small className="text-muted">
                      <b>{get(result, "requester.name")}</b> Added you to{" "}
                      <b>{get(result, "board.title")}</b>
                    </small>
                  </p>
                </div>
                <div className="card-footer text-right py-2">
                  <button
                    onClick={() =>
                      this.onAccept(result.id, get(result, "board.id"))
                    }
                    type="button"
                    className="btn btn-sm rounded-pill btn-primary mr-1" //primary
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => this.onDecline(result.id)}
                    type="button"
                    className="btn btn-sm rounded-pill btn-danger ml-1" //primary
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>
          <div className="col-lg-24 text-center ">
            <h4 className="text-center font-weight-bold pt-5">
              <Empty description={"Invited to Board is Not Found"} />
            </h4>
          </div>
        </React.Fragment>
      );

    return (
      <React.Fragment>
        <div className="col-lg-24 ">
          {loading ? "" : TitleListBoard}
          <div className="row mb-3">
            {loading ? (
              <LoadingCard />
            ) : (
              <React.Fragment>
                {listBoards}
                <div className="col-lg-8 ">
                  <div className="card bg-light">
                    <div
                      className="card-body text-center pointer"
                      onClick={() => this.handleModal("Create")}
                    >
                      <h3 className="my-5 mx-auto py-4 font-weight-bold">
                        Add New Board
                      </h3>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <hr />
          {loading || !!board_invitation_request ? "" : TitleInviteBoard}
          <div className="row mb-3">
            {loading ? (
              <LoadingCard />
            ) : (
              <React.Fragment>{board_invitation_request}</React.Fragment>
            )}
          </div>
        </div>

        <Modal
          title={`${condition} Board`}
          visible={isVisible}
          size="small"
          handleBack={this.handleClose}
        >
          {condition === "Create" && (
            <div className="container">
              <FormCreateBoard
                handleReplace={this.handleReplace}
                handleLoading={this.handleLoading}
                handleClose={this.handleClose}
              />
            </div>
          )}

          {condition === "Edit" && (
            <div className="container">
              <FormEditBoard
                handleReplace={this.handleUpdateReplace}
                initialValue={newInitialValuesEdit}
                handleLoading={this.handleLoading}
                handleClose={this.handleClose}
              />
            </div>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps)(ListBoard);
