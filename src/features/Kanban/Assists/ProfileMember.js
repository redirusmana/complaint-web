import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import Avatar from "../../../provider/Display/Avatar";
import popConfirm from "../../../provider/Display/popConfirm";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import { apiDeleteList } from "../action";
import { assetsApiUrl } from "../../../provider/Tools/general";

class ProfileMember extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRemove = user => {
    const { idBoard } = this.props;
    popConfirm({
      title: `Are you sure to remove?`,
      message: "Board will deleted on List Board",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this._requestSource = api.generateCancelToken();
          const response = await apiDeleteList(
            `/api/board/${idBoard}/delete`,
            { member_id: user.id },
            this._requestSource.token
          );
          // const { data } = response;

          if (response.status === 200) {
          }
        } catch (e) {
          const error = axiosError(e);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
        }
      }
    });
  };

  render() {
    const { results } = this.props;
    // const hasAdmin = get(results, "role.name") === "admin";
    return (
      <React.Fragment>
        <div className="media">
          <Avatar
            size="lg"
            name={get(results, "user.name")}
            image={
              get(results, "user.avatar_path")
                ? assetsApiUrl(get(results, "user.avatar_path"))
                : undefined
            }
            title={get(results, "user.name")}
            avatarClass="avatar-link m-3"
          />
          <div
            className="media-body pl-1 align-self-center"
            style={{ fontSize: "16px" }}
          >
            <div className="activity-item-header">
              <div>
                <small>
                  <b className="font-weight-bold">
                    {get(results, "user.name")}
                  </b>
                </small>
              </div>
              <div className="pl-1">
                <small>
                  <b className="font-weight-bold">
                    {get(results, "user.username")}
                  </b>
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column my-2">
          <div className="p-2  pointer hovered-button-popover text-dark">
            Permission <b>(Admin)</b>
          </div>
          <Link
            to="/user/activity"
            className="p-2 text-dark pointer hovered-button-popover"
          >
            Views Activity
          </Link>
          {/* {hasAdmin && (
            <div
              onClick={() => this.handleRemove(results.user)}
              className="p-2 pointer hovered-button-popover text-dark"
            >
              Remove From Board..
            </div>
          )} */}
        </div>
      </React.Fragment>
    );
  }
}

export default ProfileMember;
