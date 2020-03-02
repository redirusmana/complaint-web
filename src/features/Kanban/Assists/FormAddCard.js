import React from "react";
import "moment/locale/id";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import TextareaAutosize from "../../../provider/Commons/TextareaAutosize";

const initialTitle = "";

class FormAddCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      title: initialTitle,
      isSubmitting: false
    };
  }

  openEditable = () => {
    this.setState({
      editable: true
    });
  };

  closeEditable = () => {
    this.setState({
      editable: false,
      title: ""
    });
  };

  handleTitleChange = e => {
    const { value } = e.target;
    this.setState({
      title: value
    });
  };

  handleTitleKeypress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSubmit(e);
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.title === initialTitle) {
      return;
    }

    this.setState(
      {
        isSubmitting: true
      },
      () => {
        this.createStep(this.state.title);
      }
    );
  };

  async createStep(title) {
    const { idBoard } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/board/${idBoard}/list`;
      const { data } = await api.post(url, {
        title
      });

      if (data.success === "OK") {
        this.props.addTaskCard({
          newTask: data.list
        });
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
    }
    this.closeEditable();
    this.setState({
      isSubmitting: false
    });
  }

  render() {
    const { editable, title, isSubmitting } = this.state;

    if (editable) {
      return (
        <form onSubmit={this.handleSubmit} className="kanban-column-header">
          <div className="form-group">
            <TextareaAutosize
              placeholder="Enter List title"
              inputClassName="form-control"
              value={title}
              onTextChange={this.handleTitleChange}
              onKeyPress={this.handleTitleKeypress}
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div className="d-flex flex-row">
            <button type="submit" className="btn btn-primary">
              Create List
            </button>
            <button
              type="button"
              className="btn btn-link text-primary"
              onClick={this.closeEditable}
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className="kanban-column-header p-2">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={this.openEditable}
        >
          <i className="icofont-plus" /> <span>Add a new List</span>
        </button>
      </div>
    );
  }
}

export default FormAddCard;
