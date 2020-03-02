import React from "react";
import { connect } from "react-redux";
import LoadingCard from "../../../provider/Display/LoadingCard";
import Avatar from "../../../provider/Display/Avatar";
import FormEditMail from "../Modal/FormEditMail";
import FormEditPassword from "../Modal/FormEditPassword";
import FormEditPhone from "../Modal/FormEditPhone";
import FormEditProfile from "../Modal/FormEditProfile";
import Modal from "../../../provider/Display/Modal";
import { assetsApiUrl } from "../../../provider/Tools/general";
// import {} from "../../../provider/Tools/config";
import { AUTH_SET_LOGOUT, removeToken } from "../../Auth/action";
import api from "../../../provider/Tools/api";
import "../Style/style.css";

class PageProfileInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      editAble: "",
      isVisible: false,
      initialValues: {}
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        // const { user } = this.props;
        this._requestSource = api.generateCancelToken();
        api
          .get(`/api/auth/info`, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              initialValues: data.response,
              loading: false
            });
          })
          .catch(error => console.log(error));
      }
    );
  };

  handleReplace = newInitialValues => {
    this.setState({
      initialValues: newInitialValues
    });
  };

  handleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  handleModal = editAble => {
    this.setState({
      isVisible: true,
      editAble
    });
  };

  handleClose = () => {
    this.setState({
      isVisible: false
    });
  };

  handleLogout = () => {
    api.unsetToken();
    removeToken();
    this.props.setLogout();
  };

  render() {
    const { isVisible, editAble, loading, initialValues } = this.state;

    return (
      <React.Fragment>
        <div className="card mb-3">
          {loading ? (
            <LoadingCard />
          ) : (
            <React.Fragment>
              <div className="card-header mx-auto my-2">
                <Avatar
                  avatarClass="avatar-link avatar-huge "
                  image={
                    initialValues.avatar_path
                      ? assetsApiUrl(initialValues.avatar_path)
                      : undefined
                  }
                  size="md"
                  name={initialValues.name || ""}
                  title={initialValues.name || ""}
                />
              </div>
              <div className="card-body">
                <h3 className="text-center">
                  {`${initialValues.name}` || " - "}
                </h3>
                <hr />
                <div className="d-flex my-2 flex-row font-weight-normal">
                  <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                    Username
                  </div>
                  <div className="ml-2">{initialValues.username || " - "}</div>
                </div>
                <div className="d-flex my-2 flex-row font-weight-normal">
                  <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                    Gender
                  </div>
                  <div className="ml-2">{initialValues.gender || " - "}</div>
                </div>
                <div className="d-flex my-2 flex-row font-weight-normal">
                  <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                    Date of Birth
                  </div>
                  <div className="ml-2">{initialValues.birth || " - "}</div>
                </div>
              </div>
              <p className="font-weight-normal mx-4">
                <button
                  type="button"
                  className="btn btn-block btn-primary btn-sm"
                  onClick={() => this.handleModal("edit-profile")}
                >
                  <i className="font-weight-normal icofont-gear" /> Edit
                </button>
              </p>
            </React.Fragment>
          )}
        </div>

        <div className="card mb-3">
          {loading ? (
            <LoadingCard />
          ) : (
            <div className="card-body">
              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  {initialValues.email || " - "}
                </div>
                <div className="ml-2">
                  <button
                    onClick={() => this.handleModal("edit-mail")}
                    type="button"
                    className="btn btn-block btn-primary btn-sm "
                    disabled
                  >
                    <i className="icofont-lock" />
                  </button>
                </div>
              </div>

              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  {initialValues.phone_number
                    ? `+62 ${initialValues.phone_number}`
                    : " - "}
                </div>
                <div className="ml-2">
                  <button
                    onClick={() => this.handleModal("edit-phone")}
                    type="button"
                    className="btn btn-block btn-primary btn-sm"
                  >
                    <i className="icofont-gear" />
                  </button>
                </div>
              </div>

              <div className="d-flex my-2 flex-row font-weight-normal">
                <div className="mr-auto" style={{ wordBreak: "break-all" }}>
                  ****************
                </div>
                <div className="ml-2">
                  <button
                    onClick={() => this.handleModal("edit-password")}
                    type="button"
                    className="btn btn-block btn-primary btn-sm"
                  >
                    <i className="icofont-gear" />
                  </button>
                </div>
              </div>
              <p className="font-weight-normal">
                <button
                  type="button"
                  onClick={() => this.handleLogout()}
                  className="btn btn-block btn-primary btn-sm" //danger
                >
                  Logout   <i className="font-weight-normal icofont-exit" /> 
                </button>
              </p>
            </div>
          )}
        </div>

        <Modal
          title="Edit Profile"
          visible={isVisible}
          size="medium"
          handleBack={this.handleClose}
        >
          <div className="container">
            {editAble === "edit-profile" && (
              <FormEditProfile
                handleReplace={this.handleReplace}
                handleClose={this.handleClose}
                handleLoading={this.handleLoading}
                initialValues={initialValues}
              />
            )}
            {editAble === "edit-mail" && (
              <FormEditMail
                handleReplace={this.handleReplace}
                handleClose={this.handleClose}
                handleLoading={this.handleLoading}
                initialValues={initialValues}
              />
            )}
            {editAble === "edit-phone" && (
              <FormEditPhone
                handleReplace={this.handleReplace}
                handleClose={this.handleClose}
                handleLoading={this.handleLoading}
                initialValues={initialValues}
              />
            )}
            {editAble === "edit-password" && (
              <FormEditPassword
                handleReplace={this.handleReplace}
                handleClose={this.handleClose}
                handleLoading={this.handleLoading}
                initialValues={initialValues}
              />
            )}
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setLogout: () =>
    dispatch({
      type: AUTH_SET_LOGOUT
    })
});

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps, mapDispatchToProps)(PageProfileInfo);
