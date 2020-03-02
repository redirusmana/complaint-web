import React from 'react';

import AntInputNumber from 'antd/lib/input-number';
import 'antd/lib/input-number/style/index.css';
import 'antd/lib/input/style/css';

class InputNumber extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    const { onChange } = this.props;
    if (typeof value === 'number') {
      onChange(value);
    }
  }

  render() {
    const { wrapClassName, onChange, ...restProps } = this.props;
    return (
      <div className={`form-wrapper ${wrapClassName}`}>
        <AntInputNumber className="w-100" {...restProps} onChange={this.handleChange} />
      </div>
    );
  }
}

InputNumber.defaultProps = {
  wrapClassName: ''
};

export default InputNumber;
