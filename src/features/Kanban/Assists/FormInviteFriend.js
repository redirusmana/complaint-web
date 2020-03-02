import React from "react";
import get from "lodash/get";
import * as yup from "yup";
import { Empty } from "antd";
import { Formik } from "formik";
import cn from "classnames";
import api from "../../../provider/Tools/api";
import Avatar from "../../../provider/Display/Avatar";
import "../Style/style.css";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import InputSelectLong from "../../../provider/Commons/InputSelectLong";
import alertFloat from "../../../provider/Display/alertFloat";
import LoadingCard from "../../../provider/Display/LoadingCard";
import { apiInvitetoBoard } from "../action";
import { assetsApiUrl } from "../../../provider/Tools/general";

const formInviteValidation = yup.object().shape({
  members: yup.string().required("Field Must be filled in First")
});

class FormInviteFriend extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: {
        members: undefined
      },
      inviteOption: undefined,
      boardMember: undefined,
      pendingMember: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.getListFriend();
  }

  getListFriend = () => {
    const { idBoard } = this.props;
    this.setState(
      {
        loading: true
      },
      () => {
        const ROUTE_API = `api/friend/board/${idBoard}`;
        this._requestSource = api.generateCancelToken();
        api
          .get(ROUTE_API, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              inviteOption: data.friends,
              boardMember: data.members,
              pendingMember: data.pending_member,
              loading: false
            });
          })
          .catch(error => console.log(error));
      }
    );
  };

  handleSubmit = async (values, actions) => {
    const { idBoard } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const response = await apiInvitetoBoard(
        values,
        idBoard,
        this._requestSource.token
      );
      const { data } = response;

      if (response.status === 200) {
        alertFloat({
          type: "success",
          content: data.message
        });
        this.setState({
          initialValues: {
            members: undefined
          }
        });
        this.props.handleClose();
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
    actions.setSubmitting(false);
  };

  render() {
    const {
      inviteOption,
      boardMember,
      pendingMember,
      initialValues,
      loading
    } = this.state;
    if (loading) {
      return <LoadingCard />;
    }

    const TitleMember = (
      <React.Fragment>
        <h5 className="pl-3">
          <i className="icofont-group"></i> List Member Board
        </h5>
      </React.Fragment>
    );

    const mappedMember =
      Array.isArray(boardMember) && boardMember.length > 0 ? (
        boardMember.map(result => (
          <React.Fragment
            key={`list-board-member-already-${result.id}-${result.memberable_id}`}
          >
            <div className="my-2">
              <div className="media">
                <Avatar
                  size="md"
                  image={
                    get(result, "user.avatar_path")
                      ? assetsApiUrl(get(result, "user.avatar_path"))
                      : undefined
                  }
                  name={get(result, "user.name")}
                  title={get(result, "user.name")}
                  avatarClass="avatar-link m-1"
                />
                <div
                  className="media-body pl-1 align-self-center"
                  style={{ fontSize: "16px" }}
                >
                  <div className="activity-item-header">
                    <div>
                      <small>
                        <b className="font-weight-bold">
                          {get(result, "user.name")}
                        </b>
                      </small>
                    </div>
                    <div className="pl-1">
                      <small>
                        <b className="font-weight-bold">
                          {/* <i> */}
                          {get(result, "user.username")}
                          {/* </i> */}
                        </b>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>
          <div className="col-lg-24 text-center">
            <Empty description={"Member Board not Found"} />
          </div>
        </React.Fragment>
      );

    const TitlePending = (
      <React.Fragment>
        <h5 className="pl-3">
          <i className="icofont-group"></i> List Pending Member
        </h5>
      </React.Fragment>
    );

    const mappedPending =
      Array.isArray(pendingMember) && pendingMember.length > 0 ? (
        pendingMember.map(result => (
          <React.Fragment
            key={`list-board-member-pending-${result.id}-${result.invitation_id}`}
          >
            <div className="my-2">
              <div className="media">
                <Avatar
                  size="md"
                  image={
                    get(result, "respondent.avatar_path")
                      ? assetsApiUrl(get(result, "respondent.avatar_path"))
                      : undefined
                  }
                  name={get(result, "respondent.name")}
                  title={get(result, "respondent.name")}
                  avatarClass="avatar-link m-1"
                />
                <div
                  className="media-body pl-1 align-self-center"
                  style={{ fontSize: "16px" }}
                >
                  <div className="activity-item-header">
                    <div>
                      <small>
                        <b className="font-weight-bold">
                          {get(result, "respondent.name")}
                        </b>
                      </small>
                    </div>
                    <div className="pl-1">
                      <small>
                        <b className="font-weight-bold">
                          {/* <i> */}
                          {get(result, "respondent.username")}
                          {/* </i> */}
                        </b>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        <React.Fragment>
          <div className="col-lg-24 text-center">
            <Empty description={"Pending invited Board is Not Found"} />
          </div>
        </React.Fragment>
      );

    return (
      <React.Fragment>
        <Formik
          initialValues={initialValues}
          validationSchema={formInviteValidation}
          onSubmit={this.handleSubmit}
          render={({
            values,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            errors
          }) => (
            <div className="row">
              <div className="col-lg-24">
                <form className="form-horizontal p-2" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Invite Friend to Board
                    </label>
                    <InputSelectLong
                      className="form-control"
                      name="members"
                      mode="multiple"
                      onChange={value => setFieldValue("members", value)}
                      options={inviteOption || undefined}
                      placeholder="Friend"
                      value={values.members}
                    />
                    {errors && errors.members && (
                      <p className="text-danger">{errors.members}</p>
                    )}
                  </div>
                  <div className="form-group ">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block font-weight-bold"
                      disabled={isSubmitting}
                    >
                      <i
                        className={cn({
                          la: true,
                          "la-save": !isSubmitting,
                          "la-circle-o-notch animate-spin": isSubmitting
                        })}
                      />{" "}
                      {isSubmitting ? "Submitting" : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        />

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {mappedPending.length > 0 ? TitlePending : ""}
              <div className="d-flex flex-column flex-nowrap">
                {mappedPending}
              </div>
            </div>

            <div className="col-md-12">
              {mappedMember.length > 0 ? TitleMember : ""}
              <div className="d-flex flex-column flex-nowrap">
                {mappedMember}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FormInviteFriend;
