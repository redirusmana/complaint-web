import React from "react";
import get from "lodash/get";
import * as yup from "yup";
import Popover from "antd/lib/popover";
import "antd/lib/popover/style/index.css";
import { Formik } from "formik";
import cn from "classnames";
import api from "../../../provider/Tools/api";
import Avatar from "../../../provider/Display/Avatar";
import "../Style/style.css";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import popConfirm from "../../../provider/Display/popConfirm";
import InputSelectLong from "../../../provider/Commons/InputSelectLong";
import alertFloat from "../../../provider/Display/alertFloat";
// import LoadingCard from "../../../provider/Display/LoadingCard";
import { apiInvitetoCard ,apiDeleteCard } from "../action";
import { assetsApiUrl } from "../../../provider/Tools/general";

const formInviteValidation = yup.object().shape({
  members: yup.string().required("Field Must be filled in First")
});

class MembersCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: {
        members: undefined
      },
      inviteOption: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.getListFriend();
  }

  getListFriend = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        const { cardId } = this.props;
        const ROUTE_API = `api/friend/card/${cardId}`;
        this._requestSource = api.generateCancelToken();
        api
          .get(ROUTE_API, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              inviteOption: data.friends,
              loading: false
            });
          })
          .catch(error => console.log(error));
      }
    );
  };

  handleRemove = user => {
    popConfirm({
      title: `Are you sure to remove ${user.name} from this Card?`,
      message: `${user.name} will deleted on card Member`,
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this._requestSource = api.generateCancelToken();
          const response = await apiDeleteCard(
            `/api/card/`,
            this._requestSource.token
          );
          const { data } = response;
          if (response.status === 200) {
            alertFloat({
              type: "success",
              content: data.message
            });
          }
        } catch (err) {
          const error = axiosError(err);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
        }
      },
      onCancel: () => {}
    });
  }


  renderMembers() {
    const { members } = this.props;
    return (
      <div className="avatar-list">
        {Array.isArray(members) && members.length > 0 ? (
          members.map(result => (
            <React.Fragment
              key={`list-member-on/in-card-${result.id}-${result.user_id}`}
            >
              <Popover
            trigger="click"
            content={<button type="button" onClick={()=>{this.handleRemove(result.user)}} className="btn btn-sm btn-danger" title="Remove From Card"><i className="icofont-trash "></i></button>}
            placement="bottom"
            overlayClassName="popover-noarrow"
          >
            <div>
            <Avatar
                name={get(result, "user.name")}
                title={get(result, "user.name")}
                image={
                  get(result, "user.avatar_path")
                    ? assetsApiUrl(get(result, "user.avatar_path"))
                    : undefined
                }
                size="md"
              />
            </div>
          </Popover>
            </React.Fragment>
          ))
        ) : (
          <React.Fragment>
            <em>No Member found</em>;
          </React.Fragment>
        )}
      </div>
    );
  }

  handleSubmit = async (values, actions) => {
    const { cardId } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const response = await apiInvitetoCard(
        values,
        cardId,
        this._requestSource.token
      );
      const { data } = response;
      this.props.handleAddMemberCard(data.results);
      this.props.handleReplace({ newActivities: data.history });
      this.setState({
        initialValues: {
          members: undefined
        }
      });
      if (response.status === 200) {
        alertFloat({
          type: "success",
          content: data.message
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
    actions.setSubmitting(false);
  };

  render() {
    const { inviteOption, initialValues } = this.state;
    const popoverContent = (
      <div>
        <div style={{ minWidth: 250 }}>
          <div className="mb-2 text-center font-weight-bold">List Members</div>
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
                        Invite Friend to Card
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
        </div>
      </div>
    );

    return (
      <React.Fragment>
        {this.renderMembers()}
        <div>
          <Popover
            trigger="click"
            content={popoverContent}
            placement="top"
            overlayClassName="popover-noarrow"
          >
            <button type="button" className="btn btn-link text-primary">
              <i className="icofont-plus icon-left" /> Add Member
            </button>
          </Popover>
        </div>
      </React.Fragment>
    );
  }
}

export default MembersCard;
