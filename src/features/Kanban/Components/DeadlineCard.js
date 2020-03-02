import React from "react";
// import get from "lodash/get";
import moment from "moment";
import "moment/locale/id";
import InputDate from "../../../provider/Commons/InputDate";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";

moment.locale("id");

class DeadlineCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { due_date: undefined };
  }

  onTaskDeadlineChange = value => {
    this.setState({ due_date: value }, () => {
      this.handleChangeDueDate(value);
    });
  };

  handleChangeDueDate = async value => {
    const { cardId } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${cardId}`;
      const response = await api.put(url, {
        due_date: value
      });
      const { data } = response;
      console.log(data)
      if (response.status === 200) {
        this.setState({
          due_date: data.data.due_date
        });
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
    const { due_date } = this.state;
    const { due_dates } = this.props;
    return (
      <div className="task-detail-tag">
        <p className="mb-0">Due Date</p>
        <div className="d-flex flex-row align-items-center">
          <span className="badge badge-light">
            <InputDate
              name="task-detail-deadline"
              onChange={this.onTaskDeadlineChange}
              format="YYYY MMMM DD"
              wrapClassName="task-input-date cursor-pointer"
              placeholder="Deadline for this task"
              isBlockAfterToday={false}
              defaultValue={
                due_dates
                  ? moment(due_dates) || moment(due_date)  
                  : undefined
              }
              // defaultValue={moment(due_date) || moment(dataSource.due_date)}
            />
          </span>
        </div>
      </div>
    );
  }
}

DeadlineCard.defaultProps = {
  due_dates: undefined
};

export default DeadlineCard;
