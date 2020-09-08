import React from 'react';
import PropTypes from 'prop-types';
import AntTooltip from 'antd/lib/tooltip';
import 'antd/lib/tooltip/style/index.css';

const Tooltip = ({ title, placement, children, ...restProps }) => (
  <AntTooltip title={title} placement={placement} {...restProps}>
    {children}
  </AntTooltip>
);

Tooltip.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
  placement: PropTypes.string,
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number
};

Tooltip.defaultProps = {
  title: '',
  placement: 'bottom',
  mouseEnterDelay: 0.25,
  mouseLeaveDelay: 0.1
};

export default Tooltip;
