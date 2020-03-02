import message from 'antd/lib/message';
import 'antd/lib/message/style/index.css';

message.config({
  top: 100,
  duration: 5
});

const defaultAlertClose = () => {};

const alertFloat = ({ type, content, onAlertClose = defaultAlertClose, duration = 5 }) => {
  switch (type) {
    case 'success':
      return message.success(content, duration, onAlertClose);
    case 'warning':
      return message.warning(content, duration, onAlertClose);
    case 'error':
      return message.error(content, duration, onAlertClose);
    default:
      return message.info(content, duration, onAlertClose);
  }
};

export default alertFloat;
