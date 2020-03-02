import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import pick from "lodash/pick";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import Select from "antd/lib/select";
import "antd/lib/select/style/index.css";

class InputSelectLong extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      slicedOptions: props.options ? props.options : []
    };

    this.loadOptions = this.loadOptions.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeselect = this.handleDeselect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.sliceOptions = this.sliceOptions.bind(this);
    this.delaySetSlice = debounce(this.sliceOptions, 400);
  }

  componentDidMount() {
    this.loadOptions();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.options, this.props.options)) {
      this.loadOptions();
    }
  }

  loadOptions() {
    const { options, optionLimit } = this.props;
    this.setState({
      slicedOptions: Array.isArray(options) ? options.slice(0, optionLimit) : []
    });
  }

  handleSearch(searchValue) {
    this.sliceOptions(searchValue);
  }

  handleSelect(value) {
    if (this.props.onSelect) {
      this.props.onSelect(value);
      this.delaySetSlice();
    }
  }

  handleDeselect(value) {
    if (this.props.onDeselect) {
      this.props.onDeselect(value);
      this.delaySetSlice();
    }
  }

  sliceOptions(searchValue, searchKey = "label", callback) {
    const { options, optionLimit } = this.props;
    const filteredOptions = searchValue
      ? options.filter(
          item =>
            String(get(item, searchKey))
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) >= 0
        )
      : options;

    const slicedOptions = filteredOptions.slice(0, optionLimit);
    this.setState(
      {
        slicedOptions
      },
      callback
    );
  }

  render() {
    const { slicedOptions } = this.state;
    const {
      allowClear,
      notFoundText,
      disabled,
      name,
      placeholder,
      mode,
      wrapClassName,
      className,
      defaultActiveFirstOption,
      onChange,
      size
    } = this.props;

    const valueProps = pick(this.props, ["defaultValue", "value"]);

    return (
      <div className={`form-wrapper ${wrapClassName}`}>
        <Select
          allowClear={allowClear}
          className={className}
          disabled={disabled}
          onChange={onChange}
          showSearch
          defaultActiveFirstOption={defaultActiveFirstOption}
          getPopupContainer={() =>
            document.getElementById(`select-options-${name}`)
          }
          notFoundContent={notFoundText}
          onSearch={this.handleSearch}
          filterOption={false}
          placeholder={placeholder}
          mode={mode}
          onSelect={this.handleSelect}
          onDeselect={this.handleDeselect}
          {...valueProps}
        >
          {slicedOptions.map(
            ({ label, value: optionValue, ...restOptions }) => (
              <Select.Option
                value={optionValue}
                {...restOptions}
                key={restOptions.key || `${name}-${optionValue}`}
              >
                {label}
              </Select.Option>
            )
          )}
        </Select>
        <div
          id={`select-options-${name}`}
          className={`form-select-options-${size}`}
        />
      </div>
    );
  }
}

InputSelectLong.propTypes = {
  name: PropTypes.string.isRequired,
  defaultActiveFirstOption: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})),
  handleChange: PropTypes.func,
  notFoundText: PropTypes.string,
  size: PropTypes.string,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  wrapClassName: PropTypes.string,
  optionLimit: PropTypes.number,
  mode: PropTypes.string
};

InputSelectLong.defaultProps = {
  defaultActiveFirstOption: false,
  placeholder: "Select one from option below",
  handleChange: () => {},
  options: [],
  notFoundText: "Option not found",
  size: "default",
  allowClear: true,
  disabled: false,
  className: "",
  wrapClassName: "",
  optionLimit: 50,
  mode: "default"
};

export default InputSelectLong;
