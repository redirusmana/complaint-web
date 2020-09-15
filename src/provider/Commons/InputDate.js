import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "antd/lib/date-picker";
import "antd/lib/date-picker/style/index.css";
import "antd/lib/input/style/css";
import "moment/locale/id";

moment.locale("id");

const InputDate = ({
  handleChange,
  placeholder,
  name,
  size,
  disabled,
  initialValue,
  isBlockAfterToday,
  format,
  mode,
  wrapClassName,
  className,
  ...rest
}) => (
  <div className={`form-wrapper ${wrapClassName}`}>
    <DatePicker
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      dateRender={current => {
        const style = {};

        if (
          initialValue.length > 0 &&
          initialValue.filter(item =>
            moment(current).isSame(moment(item), "day")
          ).length > 0
        ) {
          style.borderRadius = "50%";
          style.color = "#fff";
          style.backgroundColor = "#2D95F3";
        }

        return (
          <div className="ant-calendar-date" style={style}>
            {current.date()}
          </div>
        );
      }}
      getCalendarContainer={() =>
        document.getElementById(`input-date-container-${name}`)
      }
      size={size}
      disabled={disabled}
      disabledDate={current => {
        if (mode === "date") {
          if (isBlockAfterToday) {
            return current && current > moment().endOf("day");
          }
        }
        return false;
      }}
      format={format}
      {...rest}
    />
    <div id={`input-date-container-${name}`} />
  </div>
);

InputDate.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  initialValue: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  isBlockAfterToday: PropTypes.bool,
  allowedValue: PropTypes.arrayOf(PropTypes.string),
  format: PropTypes.string,
  mode: PropTypes.string,
  wrapClassName: PropTypes.string
};

InputDate.defaultProps = {
  handleChange: () => {},
  placeholder: "Choose a date",
  size: "default",
  disabled: false,
  initialValue: [],
  className: "form-control",
  isBlockAfterToday: true,
  allowedValue: [],
  format: "YYYY-MM-DD",
  mode: "date",
  wrapClassName: ""
};

export default InputDate;
