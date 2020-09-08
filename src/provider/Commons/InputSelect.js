import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import 'antd/lib/select/style/index.css';

const InputSelect = ({ options, handleChange, notFoundText, name, ...rest }) => (
  <div className={`form-wrapper ${rest.wrapClassName}`}>
    <Select
      className={rest.className}
      onChange={handleChange}
      defaultActiveFirstOption={rest.defaultActiveFirstOption}
      getPopupContainer={() => document.getElementById(`select-options-${name}`)}
      notFoundContent={notFoundText}
      {...rest}
    >
      {options.map(({ label, value, ...restOptions }) => (
        <Select.Option value={value} {...restOptions} key={restOptions.key || `${name}-${value}`}>
          {label}
        </Select.Option>
      ))}
    </Select>
    <div id={`select-options-${name}`} className={`form-select-options-${rest.size}`} />
  </div>
);

InputSelect.propTypes = {
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
  wrapClassName: PropTypes.string
};

InputSelect.defaultProps = {
  defaultActiveFirstOption: false,
  placeholder: 'Select one from option below',
  handleChange: () => {},
  options: [],
  notFoundText: 'Option not found',
  size: 'default',
  allowClear: true,
  disabled: false,
  className: '',
  wrapClassName: ''
};

export default InputSelect;
