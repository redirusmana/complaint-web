import React from "react";
import PropTypes from "prop-types";
import Upload from "antd/lib/upload";
import "antd/lib/upload/style/index.css";

const { Dragger } = Upload;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

class InputImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewImage: props.previewImage,
      previewName: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.previewImage &&
      this.props.previewImage !== prevProps.previewImage
    ) {
      this.setPreviewImage();
    }
  }

  setPreviewImage = () => {
    this.setState({
      previewImage: this.props.previewImage
    });
  };

  onBeforeUpload = file => {
    getBase64(file, result => {
      this.setState(
        {
          previewImage: result,
          previewName: file.name
        },
        () => {
          this.props.onFileChange(file, result);
        }
      );
    });
    return false;
  };

  render() {
    const { placeholder, multiple, icon, name, acceptFormat } = this.props;
    const { previewImage, previewName } = this.state;

    const draggerProps = {};
    if (acceptFormat) {
      draggerProps.accept = acceptFormat;
    }
    return (
      <Dragger
        className="upload-drag"
        name={name}
        multiple={multiple}
        beforeUpload={this.onBeforeUpload}
        showUploadList={false}
        {...draggerProps}
      >
        {previewImage ? (
          <div className="d-block">
            <img
              src={previewImage}
              className="img-fluid"
              alt="preview-input-upload"
            />
            <p className="mt-3 mb-0">{previewName}</p>
          </div>
        ) : (
          <div className="d-block">
            <div className="mb-0" style={{ fontSize: 48 }}>
              <i className={icon} />
            </div>
            {placeholder}
          </div>
        )}
      </Dragger>
    );
  }
}

InputImage.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  previewImage: PropTypes.string,
  multiple: PropTypes.bool,
  onFileChange: PropTypes.func,
  icon: PropTypes.string
};

InputImage.defaultProps = {
  name: "file",
  placeholder: "Choose a file to upload",
  multiple: false,
  onFileChange: () => {},
  previewImage: "",
  icon: "icofont-box"
};

export default InputImage;
