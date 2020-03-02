import React from "react";
import PropTypes from "prop-types";
import AntModal from "antd/lib/modal";
import "antd/lib/modal/style/index.css";

const Modal = ({
  size,
  children,
  title,
  visible,
  handleBack,
  closeOnOutside,
  afterClose,
  wrapClassName,
  showTitle
}) => {
  const modalClassName = wrapClassName
    ? `ant-modal-${size} ${wrapClassName}`
    : `ant-modal-${size}`;

  return (
    <AntModal
      visible={visible}
      title={showTitle ? title : ""}
      footer={null}
      onCancel={handleBack}
      wrapClassName={modalClassName}
      width="auto"
      maskClosable={closeOnOutside}
      afterClose={afterClose}
      destroyOnClose
    >
      {children}
    </AntModal>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  handleBack: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  closeOnOutside: PropTypes.bool,
  afterClose: PropTypes.func,
  wrapClassName: PropTypes.string,
  showTitle: PropTypes.bool
};

Modal.defaultProps = {
  visible: false,
  title: "",
  size: "medium",
  closeOnOutside: true,
  afterClose: () => {},
  wrapClassName: "",
  showTitle: true
};

export default Modal;
