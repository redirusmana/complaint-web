import React from "react";
import Popover from "antd/lib/popover";
import "antd/lib/popover/style/index.css";

import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";

const initialValue = "";
const containerId = "task-checklist-form";

class ChecklistCardGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      value: initialValue
    };
  }

  onFormSubmit = async e => {
    e.preventDefault();
    const { listId } = this.props;
    const { value } = this.state;
    const title = { title: value };

    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${listId}/checklist`;
      const { data } = await api.post(url, title);

      const {activity,...allValues} = data.data;
      this.props.handleReplace({newActivities:activity});
      this.props.handleAddChecklist(allValues);

      // this.setState({ isSubmitting: false });
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }

      // this.setState({ isSubmitting: false });
    }

    this.toggleForm();
  };

  changeName = e => {
    const { value } = e.target;
    this.setState({
      value
    });
  };

  toggleForm = () => {
    const { showForm, value } = this.state;

    if (!showForm) {
      document.addEventListener("click", this.handleClickOutside, false);
    } else {
      document.removeEventListener("click", this.handleClickOutside, false);
    }

    this.setState({
      showForm: !showForm,
      value: !showForm ? initialValue : value
    });
  };

  handleClickOutside = e => {
    const wrappedDOM = document.getElementById(containerId);
    if (!wrappedDOM) {
      return;
    }

    if (wrappedDOM.contains(e.target)) {
      return;
    }

    this.toggleForm();
  };

  render() {
    const { showForm, value } = this.state;

    const popoverContent = (
      <form onSubmit={this.onFormSubmit} style={{ minWidth: 300 }}>
        <div className="form-group">
          <label htmlFor="task-new-checklist-group" className="form-label">
             Checklist Group
          </label>
          <input
            id="task-new-checklist-group"
            type="text"
            value={value}
            onChange={this.changeName}
            className="form-control"
            autoFocus={showForm}
            autoComplete="off"
          />
        </div>
        <div className="text-left">
          <button type="submit" className="btn btn-primary btn-sm" disabled={!value}>
            <i className="icofont-plus" /> Create
          </button>
        </div>
      </form>
    );

    return (
      <div id={containerId}>
        <Popover
          content={popoverContent}
          placement="bottomRight"
          visible={showForm}
          getPopupContainer={() => document.getElementById(containerId)}
          overlayClassName="popover-noarrow"
        >
          <button
            type="button"
            className="btn btn-link text-primary"
            onClick={this.toggleForm}
          >
            <i className="icofont-plus" /> Add Checklist
          </button>
        </Popover>
      </div>
    );
  }
}

export default ChecklistCardGroup;
