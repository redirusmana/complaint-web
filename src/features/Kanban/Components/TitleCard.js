import React from "react";
import debounce from "lodash/debounce";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import "../Style/style.css";
import EditingTask from "../Assists/EditingTask";

class TitleCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { title: "" };
    this.delayFetchUnique = debounce(this.handleFetchTyping, 600);
  }

  onTaskTitleChange = value => {
    this.setState(
      {
        title: value
      },
      () => {
        this.delayFetchUnique(value);
      }
    );
  };

  handleFetchTyping = async value => {
    const { cardId } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${cardId}`;
      const response = await api.put(url, {
        title: value
      });
      const { data } = response;

      if (response.status === 200) {
        this.props.handleReplace({ newActivities: data.data.activity });
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
    }
  };

  render() {
    const { title } = this.state;
    const { titles } = this.props;
    return (
      <div className="task-detail-title">
        <EditingTask
          initialValue={title || titles}
          submitChanges={this.onTaskTitleChange}
        />
      </div>
    );
  }
}

export default TitleCard;
