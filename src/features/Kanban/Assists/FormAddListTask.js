import React from "react";
import get from "lodash/get";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import TextareaAutosize from "../../../provider/Commons/TextareaAutosize";

const initialFormState = {
  title: "",
  previous_card_id: ""
};

class FormAddListTask extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      form: initialFormState,
      formVisible: false,
      isSubmitting: false
    };
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, false);
  }

  onToggleCreate = () => {
    const { formVisible } = this.state;

    if (!formVisible) {
      document.addEventListener("click", this.handleClickOutside, false);
    } else {
      document.removeEventListener("click", this.handleClickOutside, false);
    }

    this.setState({
      formVisible: !formVisible
    });
  };

  onTaskTitleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.submitTask();
      this.resetForm();
    }
  };

  onTaskTitleChange = ({ target }) => {
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        title: target.value
      }
    });
  };

  onFormSubmit = e => {
    e.preventDefault();

    this.submitTask();
    this.resetForm();
  };

  onCancelForm = () => {
    this.resetForm();
    this.onToggleCreate();
  };

  submitRequest = async ({ forms, idList }) => {
    const { form, ...newValues } = forms;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/list/${idList}/card`;
      const { data } = await api.post(url, newValues);
      // console.log(data);
      // console.log(data.card);

      if (data.success === "OK") {
        this.props.addTask({
          newTask: data.card,
          columnIndex: this.props.columnIndex
        });
      }

      this.setState({ isSubmitting: false });
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }

      this.setState({ isSubmitting: false });
    }
  };

  submitTask() {
    const { listSource } = this.props;
    const previous_card_id = listSource.cards[listSource.cards.length - 1];
    const newId = get(previous_card_id, "id");
    const { form } = this.state;

    if (!form.title) {
      return;
    }

    this.setState(
      {
        isSubmitting: true
      },
      () => {
        this.submitRequest({
          forms: {
            ...form,
            form: form.title,
            previous_card_id: newId ? newId : null
          },
          idList: listSource.id
        });
      }
    );
  }

  resetForm = () => {
    const { form } = this.state;
    this.setState({
      form: {
        ...form,
        ...initialFormState
      }
    });
  };

  handleClickOutside = e => {
    if (this.formDOM.contains(e.target)) {
      return;
    }

    this.submitTask();
    this.resetForm();
    this.onToggleCreate();
  };

  render() {
    const { form, formVisible, isSubmitting } = this.state;

    if (!formVisible) {
      return (
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={this.onToggleCreate}
        >
          <i className="la la-plus icon-left" />
          Add New Card
        </button>
      );
    }

    return (
      <form
        onSubmit={this.onFormSubmit}
        ref={c => {
          this.formDOM = c;
        }}
      >
        <div className="kanban-cell mt-0">
          <TextareaAutosize
            value={form.title}
            inputClassName="border-0 outline-none"
            placeholder="Enter a title for this Card"
            autoFocus={formVisible}
            onTextChange={this.onTaskTitleChange}
            onKeyPress={this.onTaskTitleKeyPress}
            readOnly={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
        <div className="d-flex flex-row flex-nowrap align-items-center">
          <div className="flex-grow-1 flex-shrink-1">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <React.Fragment>
                  <i className="icofont-clock-time animate-spin" /> Saving
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="icofont-save" /> Submit Card
                </React.Fragment>
              )}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-link"
              onClick={this.onCancelForm}
            >
              <i className="icofont-close text-danger" />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default FormAddListTask;
