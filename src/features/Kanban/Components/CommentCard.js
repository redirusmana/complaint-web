import React from "react";
import { connect } from "react-redux";
import Avatar from "../../../provider/Display/Avatar";
import "../Style/style.css";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import api from "../../../provider/Tools/api";
import alertFloat from "../../../provider/Display/alertFloat";
import TextareaAutosize from "../../../provider/Commons/TextareaAutosize";
import { assetsApiUrl } from "../../../provider/Tools/general";
import { storeComment } from "../action";

class CommentCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      enterSend: true,
      loading: false
    };
  }

  onContentChange = content => {
    this.setState({
      content
    });
  };

  onContentPress = e => {
    const { enterSend } = this.state;
    if (enterSend && e.key === "Enter") {
      e.preventDefault();
      this.setState(
        {
          loading: true
        },
        () => {
          this.submitComment();
        }
      );
    }
  };

  onCheckSend = enterSend => {
    this.setState({
      enterSend
    });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState(
      {
        loading: true
      },
      () => {
        this.submitComment();
      }
    );
  };

  submitComment = async () => {
    const { content } = this.state;
    const { cardId } = this.props;
    console.log(this.props);
    const newBody = { body: content };

    try {
      this._requestSource = api.generateCancelToken();
      const response = await storeComment(
        newBody,
        cardId,
        this._requestSource.token
      );
      const { data } = response;
      if (response.status === 200) {
        this.props.handleReplace({ newActivities: data.data });
        this.setState({
          content: "",
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
      this.setState({
        content: "",
        loading: false
      });
    }
  };

  render() {
    const { content, enterSend, loading } = this.state;
    const { user } = this.props;
    return (
      <div className="task-detail-aside-footer">
        <div className="media media-comment media-comment-input">
          <Avatar
            size="md"
            name={user.name}
            image={
              user.avatar_path ? assetsApiUrl(user.avatar_path) : undefined
            }
            title={user.name}
            avatarClass="avatar-link mx-2 my-1"
          />
          <form className="media-body" onSubmit={e => this.onSubmit(e)}>
            <TextareaAutosize
              name="body"
              inputClassName="form-control pt-2 form-control"
              placeholder="Type your comment"
              value={content}
              onTextChange={e => this.onContentChange(e.target.value)}
              onKeyPress={this.onContentPress}
              disabled={loading}
            />
            <div className="form-inline justify-content-between pt-1 pb-1 px-1 bg-white">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input form-control-sm"
                  id="comment-send-enter"
                  checked={enterSend}
                  onChange={({ target }) => this.onCheckSend(target.checked)}
                  disabled={loading}
                />
                <label
                  htmlFor="comment-send-enter"
                  className="custom-control-label"
                >
                  <small>Send when enter</small>
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});
export default connect(mapStateToProps)(CommentCard);
