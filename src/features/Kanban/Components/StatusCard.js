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
import { OptStatus, OptStatusClass } from "../../../provider/Tools/config";

const TaskStatusChanger = ({
  currentStatus,
  onStatusClicked,
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
        Available Status
      </DropdownItem>
      <DropdownItem divider />
      {options.map((option, index) => (
        <DropdownItem
          tag="span"
          key={index}
          data-status={option.value}
          className="px-3"
          onClick={onStatusClicked}
        >
          <span
            className={`${
              OptStatusClass[option.value]
            } w-100 d-inline-flex align-items-center justify-content-between`}
          >
            <span>{option.value}</span>
            <span className="d-block w-5 text-right">
              {currentStatus === option.value && (
                <i className="icofont-check font-weight-bold" />
              )}
            </span>
          </span>
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

class StatusCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeStatus = e => {
    const { dataset } = e.currentTarget;
    this.setState(
      {
        status: dataset.status
      },
      () => {
        this.handleChangeStatus(dataset.status);
      }
    );
  };

  handleChangeStatus = async value => {
    const { cardId } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${cardId}`;
      const response = await api.put(url, {
        status: value
      });

      const { data } = response;

      if (response.status === 200) {
        this.setState({
          status: data.data.status
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
    const { status } = this.state;
    const { stats } = this.props;

    const mappedStatus =
      status || stats ? (
        <React.Fragment>
          <span className={`${OptStatusClass[status || stats]}`}>
            {status || stats}
          </span>
          <i className="icofont-rounded-down ml-2" />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <span className="badge badge-light">Available Status</span>
          <i className="icofont-rounded-down ml-2" />
        </React.Fragment>
      );

    return (
      <div className="task-detail-tag">
        <p className="mb-0">Status</p>
        <TaskStatusChanger
          currentStatus={status}
          onStatusClicked={this.changeStatus}
          options={OptStatus}
        >
          {mappedStatus}
        </TaskStatusChanger>
      </div>
    );
  }
}

export default StatusCard;
