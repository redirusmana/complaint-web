import React from "react";
import PropTypes from "prop-types";
import TextareaAutosize from "../../../provider/Commons/TextareaAutosize";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";

class EditingCheckGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      value: ""
    };
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, false);
  }

  onTextChange = e => {
    const { value } = e.target;
    this.setState({
      value
    });
  };

  onTextKeyPress = e => {
    const { enterWillSubmit } = this.props;
    if (e.key === "Enter" && enterWillSubmit) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  toggleEditable = () => {
    const { editable, value } = this.state;
    const { initialValue } = this.props;
    if (!editable) {
      document.addEventListener("click", this.handleClickOutside, false);
    } else {
      document.removeEventListener("click", this.handleClickOutside, false);
    }

    this.setState({
      editable: !editable,
      value: !editable ? initialValue : value
    });
  };

  handleClickOutside = e => {
    if (!this.wrappedDOM) {
      return;
    }

    if (this.wrappedDOM.contains(e.target)) {
      return;
    }

    this.handleSubmit();
  };

  handleSubmit = async () => {
    const { value } = this.state;
    const { cardId, checkId } = this.props;
    const title = { title: value };

    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${cardId}/checklist/${checkId}`;
      const { data } = await api.put(url, title);
      // console.log(data)
      this.props.renameChecklist(data);
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
      // this.setState({ isSubmitting: false });
    }

    this.toggleEditable();
  };

  render() {
    const { editable, value } = this.state;
    const { initialValue, className } = this.props;

    const editableComponent = editable ? (
      <TextareaAutosize
        value={value}
        inputClassName="border-0"
        onTextChange={this.onTextChange}
        onKeyPress={this.onTextKeyPress}
        autoFocus={editable}
      />
    ) : (
      <div
        role="button"
        className="d-block text-body w-100"
        tabIndex={0}
        onFocus={this.toggleEditable}
      >
        {initialValue}
      </div>
    );

    return (
      <div
        ref={wrappedRef => {
          this.wrappedDOM = wrappedRef;
        }}
        className={className}
      >
        {editableComponent}
      </div>
    );
  }
}

EditingCheckGroup.propTypes = {
  // renameChildChecklist:PropTypes.func,
  submitChanges: PropTypes.func,
  initialValue: PropTypes.string,
  className: PropTypes.string,
  enterWillSubmit: PropTypes.bool
  // cardId:PropTypes.number,
  // checkId:PropTypes.number,
  // parentId:PropTypes.number
};

EditingCheckGroup.defaultProps = {
  submitChanges: () => {},
  initialValue: "",
  className: "",
  enterWillSubmit: true
  // cardId:0,
  // checkId:0,
  // parentId:0
};

export default EditingCheckGroup;
