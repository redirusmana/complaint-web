import React from "react";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import AntAlert from "antd/lib/alert";

const Alert = ({
  type,
  message,
  description,
  onClose,
  closable,
  showIcon,
  iconType
}) => (
  <AntAlert
    message={message}
    type={type}
    description={description}
    onClose={onClose}
    closable={closable}
    showIcon={showIcon}
    iconType={iconType}
  />
);

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error", "info", "warning"]),
  message: PropTypes.string.isRequired,
  description: PropTypes.string,
  iconType: PropTypes.string,
  onClose: PropTypes.func,
  showIcon: PropTypes.bool,
  closable: PropTypes.bool
};

Alert.defaultProps = {
  type: "info",
  description: "",
  iconType: "",
  onClose: () => {},
  showIcon: false,
  closable: true
};

export default Alert;
