import React from "react";
// import PropTypes from 'prop-types';
// import debounce from 'lodash/debounce';
import FileSaver from "file-saver";
import get from "lodash/get";
import Upload from "antd/lib/upload";
import "antd/lib/upload/style/index.css";
import FileIcon from "../../../provider/Display/FileIcon";
import { numberToFileSize } from "../../../provider/Tools/converter";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import popConfirm from "../../../provider/Display/popConfirm";
import { downloadDSFile } from "../action";

const { Dragger } = Upload;

class FileCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { temporaryAttachments: [] };
  }

  _fileCounter = 0;

  downloadFile = async file => {
    try {
      console.log(file);
      if (file.id && file.filename) {
        this._requestSource = api.generateCancelToken();
        const response = await downloadDSFile(
          file.id,
          this._requestSource.token
        );
        console.log(response);
        FileSaver.saveAs(response.data, file.attachment.name);
      }
    } catch (e) {
      console.log(e);
    }
  };

  removeFile = attachment => {
    const fileName = get(attachment, "filename");
    popConfirm({
      title: `Are you sure to remove attachment ${fileName}?`,
      message: "The action is permanent, there is no way to get it back",
      okText: "Yes",
      cancelText: " No",
      onOkay: async () => {
        try {
          this._requestSource = api.generateCancelToken();
          const url = `/api/file/${attachment.id}`;
          const response = await api.delete(url, {
            contentType: "multipart/form-data"
          });
          const { data } = response;
          this.props.deleteAttachments(data.attachment);
          this.props.handleReplace({ newActivities: data.activity });
        } catch (e) {
          const error = axiosError(e);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
        }
      },
      onCancel: () => {},
      okType: "danger"
    });
  };

  handleFileChange = ({ file, fileList }) => {
    const mappedFile = {
      id: get(file, "id") || get(file, "uid"),
      name: file.name,
      size: file.size,
      actualFile: file
    };

    this._fileCounter += 1;

    this.setState(
      prevState => ({
        temporaryAttachments: [...prevState.temporaryAttachments, mappedFile]
      }),
      () => {
        if (this.state.temporaryAttachments.length === this._fileCounter) {
          this._fileCounter = 0;
          this.uploadFile();
        }
      }
    );
  };

  uploadFile = async () => {
    const { temporaryAttachments } = this.state;

    const { cardId } = this.props;
    const formData = new FormData();

    temporaryAttachments.forEach((attachment, i) => {
      formData.append(`attachments[${i}]`, attachment.actualFile);
    });

    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/card/${cardId}/attach/file`;
      const response = await api.post(url, formData, null, {
        contentType: "multipart/form-data"
      });
      const { data } = response;
      this.props.handleChangeAttachments(data.attachment);
      this.props.handleReplace({ newActivities: data.activity });

      this.setState({
        temporaryAttachments: []
      });
      if (response.status === 200) {
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
    }
  };

  renderAttachments() {
    const { attachments, cardId } = this.props;

    if (Array.isArray(attachments) && attachments.length > 0) {
      return attachments.map(attach => {
        const fileSize = get(attach, "size");
        const fileName = get(attach, "filename");
        const fileId = get(attach, "id");
        return (
          <div
            className="task-detail-attachment"
            key={`attachment-${cardId}-${fileId}`}
          >
            <div className="attachment-icon">
              <FileIcon fileName={fileName} size="md" />
            </div>
            <div className="attachment-detail">
              <div>{fileName}</div>
              <span>{numberToFileSize(fileSize)}</span>
            </div>
            <div className="attachment-action">
              <button
                type="button"
                className="btn btn-primary btn-sm mr-1"
                title="Download File"
                onClick={() => this.downloadFile(attach)}
              >
                <i className="icofont-download" />
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                title="Remove File"
                onClick={() => this.removeFile(attach)}
              >
                <i className="icofont-trash" />
              </button>
            </div>
          </div>
        );
      });
    }

    return <em>No attachment found</em>;
  }

  render() {
    const { temporaryAttachments } = this.state;
    return (
      <section className="task-detail-group">
        <i className="icofont-papers" />
        <div className="task-detail-subheader">
          <div className="task-detail-subtitle">
            <span>Attachments</span>
          </div>
          <div style={{ height: 150, marginBottom: "1rem" }}>
            <Dragger
              className="upload-drag"
              beforeUpload={() => false}
              showUploadList={false}
              fileList={temporaryAttachments}
              onChange={this.handleFileChange}
              multiple
            >
              <div className="d-block">
                <div className="mb-0" style={{ fontSize: 48 }}>
                  <i className="icofont-cloud-upload" />
                </div>
                Upload an attachment
              </div>
            </Dragger>
          </div>
          {this.renderAttachments()}
        </div>
      </section>
    );
  }
}

export default FileCard;
