import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import { OptPriority, OptPriorityClass } from "../../../provider/Tools/config";

const TaskPriorityChanger = ({
  currentPriority,
  onPriorityClicked,
  children,
  options
}) => (
  <UncontrolledDropdown tag="span">
    <DropdownToggle
      tag="div"
      className="d-inline-flex flex-row cursor-pointer align-items-center"
    >
      {children}
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem header className="px-3 py-1">
        Available Priority
      </DropdownItem>
      <DropdownItem divider />
      {options.map((option, index) => (
        <DropdownItem
          tag="span"
          key={index}
          data-priority={option.value}
          className="px-3"
          onClick={onPriorityClicked}
        >
          <span
            className={`${
              OptPriorityClass[option.value]
            }  w-100 d-inline-flex align-items-center justify-content-between`}
          >
            <span>{option.value}</span>
            <span className="d-block w-5 text-right">
              {currentPriority === option.value && (
                <i className="icofont-check font-weight-bold" />
              )}
            </span>
          </span>
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

class PriorityCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changePriority = e => {
    const { dataset } = e.currentTarget;
    this.setState(
      {
        priority: dataset.priority
      },
      () => {
        this.handleChangePriority(dataset.priority);
      }
    );
  };

  handleChangePriority = async value => {
    const { cardId } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${cardId}`;
      const response = await api.put(url, {
        priority: value
      });

      const { data } = response;

      if (response.status === 200) {
        this.setState({
          priority: data.data.priority
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
    const { priority } = this.state;
    const { prioritys } = this.props;

    const mappedPriority =
      priority || prioritys ? (
        <React.Fragment>
          <span
            className={`${OptPriorityClass[priority || prioritys]}`}
          >
            {priority || prioritys}
          </span>
          <i className="icofont-rounded-down ml-2" />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <span className="badge badge-light">Available Priority</span>
          <i className="icofont-rounded-down ml-2" />
        </React.Fragment>
      );

    return (
      <div className="task-detail-tag">
        <p className="mb-0">Priority</p>
        <TaskPriorityChanger
          currentPriority={priority}
          onPriorityClicked={this.changePriority}
          options={OptPriority}
        >
          {mappedPriority}
        </TaskPriorityChanger>
      </div>
    );
  }
}

export default PriorityCard;
