import AntModal from "antd/lib/modal";
import "antd/lib/modal/style/index.css";

const AntConfirm = AntModal.confirm;
const popConfirm = ({
  title = "",
  message,
  onOkay = () => {},
  onCancel = () => {},
  okText = "Yes",
  cancelText = "No",
  okType = "danger",
  iconType = "question-circle"
}) => {
  AntConfirm({
    title,
    content: message,
    onOk: onOkay,
    onCancel,
    okText,
    cancelText,
    okType,
    iconType
  });
};

export default popConfirm;
