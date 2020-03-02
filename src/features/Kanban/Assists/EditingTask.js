import React from "react";
import PropTypes from "prop-types";
import TextareaAutosize from "../../../provider/Commons/TextareaAutosize";

class EditingTask extends React.PureComponent {
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

  handleSubmit = () => {
    const { value } = this.state;
    if(!!value){
    this.props.submitChanges(value);
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

EditingTask.propTypes = {
  submitChanges: PropTypes.func,
  initialValue: PropTypes.string,
  className: PropTypes.string,
  enterWillSubmit: PropTypes.bool
};

EditingTask.defaultProps = {
  submitChanges: () => {},
  initialValue: "",
  className: "",
  enterWillSubmit: true
};

export default EditingTask;
