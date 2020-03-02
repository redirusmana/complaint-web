import React from "react";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import TextareaAutosize from "../../../provider/Commons/TextareaAutosize";

const initialFormState = {
  description: ""
};

class DescriptionCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      form: initialFormState,
      isSubmitting: false
    };
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, false);
  }

  toggleEdit = () => {
    const { editable, form } = this.state;
    const { descriptions } = this.props;

    if (!editable) {
      document.addEventListener("click", this.handleClickOutside, false);
    } else {
      document.removeEventListener("click", this.handleClickOutside, false);
    }

    this.setState({
      editable: !editable,
      form: {
        ...form,
        description: !editable ? descriptions: ""
      }
    });
  };

  onTaskDescriptionChange = e => {
    const { value } = e.target;
    const { form } = this.state;
    this.setState({
      form: {
        ...form,
        description: value
      }
    });
  };

  onFormSubmit = e => {
    e.preventDefault();
    this.setState(
      {
        isSubmitting: true
      },
      () => {
        const { form } = this.state;
        if(!!form.description){
          this.submitDescription()
        }else{
        this.setState({
          isSubmitting:false
        })
        }
      }
    );
  };

  handleClickOutside = e => {
    if (!this.formDOM) {
      return;
    }

    if (this.formDOM.contains(e.target)) {
      return;
    }

    this.toggleEdit();
  };

  submitDescription = async () => {
    const { form } = this.state;
    const { cardId } = this.props;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${cardId}`;
      const response = await api.put(url, form);
      const { data } = response;
      if (response.status === 200) {
        this.props.handleReplaceDesc(data.data.description);
        this.props.handleReplace({ newActivities: data.data.activity });
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
    }
    this.setState({ isSubmitting: false });
  };

  resetForm = () => {
    const { form } = this.state;
    this.setState({
      form: {
        ...form,
        ...initialFormState
      }
    });
  };

  renderDescription = () => {
    const { editable, form, isSubmitting } = this.state;
    const { descriptions } = this.props;

    const placeholder = "Add description to this task...";

    if (editable) {
      return (
        <React.Fragment>
          <TextareaAutosize
            value={form.description}
            inputClassName="border-0"
            autoFocus={editable}
            onTextChange={this.onTaskDescriptionChange}
            placeholder={placeholder}
            disabled={isSubmitting}
            style={{
              minHeight: 75
            }}
          />
          <div className="my-2">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <React.Fragment>
                  <i className="icofont-clock-time animate-spin" /> Saving
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="icofont-save" /> Save
                </React.Fragment>
              )}
            </button>
          </div>
        </React.Fragment>
      );
    }

    if (!descriptions) {
      return (
        <div
          role="button"
          tabIndex={0}
          className="d-block text-body mb-0"
          onFocus={this.toggleEdit}
        >
          {placeholder}
        </div>
      );
    }

    return (
      <div
        role="button"
        tabIndex={0}
        className="d-block text-body mb-0"
        onFocus={this.toggleEdit}
      >
        {descriptions.split("\n").map((item, key) => (
          <React.Fragment key={key}>
            {item}
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  render() {
    const { editable } = this.state;
    const { form } = this.state;

    return (
      <section className="task-detail-group">
        <i className="icofont-info" />
        <div>
          <div className="task-detail-subtitle">
            <span>Description</span>
            {!editable && (
              <div className="task-detail-options">
                <button
                  type="button"
                  className="btn text-primary btn-link "
                  onClick={this.toggleEdit}
                >
                  <i className="icofont-pencil icon-left" />
                  Edit Description
                </button>
              </div>
            )}
          </div>
          <form
            className="task-detail-desc"
            onSubmit={this.onFormSubmit}
            ref={form => {
              this.formDOM = form;
            }}
          >
            {this.renderDescription()}
          </form>
        </div>
      </section>
    );
  }
}

export default DescriptionCard;
