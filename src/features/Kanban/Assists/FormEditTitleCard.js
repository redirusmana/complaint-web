import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import debounce from 'lodash/debounce';
import popConfirm from "../../../provider/Display/popConfirm";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";
import TextareaAutosize from "../../../provider/Commons/TextareaAutosize";
import { apiDeleteList } from "../action";

class FormEditTitleCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      renamingTitle: undefined,
      renamingTitleName: "",
      isSubmitting: false
    };
    this.delayFetchUnique = debounce(this.handleFetchTyping, 350);
  }

  onTitleRenamingStart(Source) {
    this.setState({
      renamingTitle: Source.id,
      renamingTitleName: Source.title
    });
  }

  onTitleRenamingStop = e => {
    e.preventDefault(e);
    this.setState({
      renamingTitle: undefined,
      renamingTitleName: ""
    });
  };

  onTitleRenamingChange = e => {
    const { value } = e.target;
    this.setState({
      renamingTitleName: value
    },
    () => {
      this.delayFetchUnique(this.state.renamingTitleName);
    });
  };

  handleFetchTyping = async value => {
    const { columnSource } = this.props;
    const title = value;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/list/${columnSource.id}`;
      const { data } = await api.put(url, {
        title
      });

      if (data.success === "OK") {
        this.props.renameList({
          newTask: data.lists,
          columnIndex: this.props.columnIndex
        });
        this.setState({
          isSubmitting: false
        });
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
    }
  };

  onTitleRenamingKeypress = e => {
    const { columnSource } = this.props;
    const { renamingTitleName } = this.state;
    if (e.key === "Enter") {
      e.preventDefault();
      this.setState(
        {
          isSubmitting: true
        },
        () => {
          if (renamingTitleName !== columnSource.title) {
            this.updateRenameList(renamingTitleName, e);
          } else {
            this.setState({
              isSubmitting: false
            });
          }
        }
      );
    }
  };

  updateRenameList = async (renamingTitleName, e) => {
    const { columnSource } = this.props;
    const title = renamingTitleName;
    try {
      this._requestSource = api.generateCancelToken();
      const url = `/api/list/${columnSource.id}`;
      const { data } = await api.put(url, {
        title
      });

      if (data.success === "OK") {
        this.props.renameList({
          newTask: data.lists,
          columnIndex: this.props.columnIndex
        });
        this.setState({
          isSubmitting: false
        });
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
    }

    this.onTitleRenamingStop(e);
  };

  onDeleteList = Source => {
    popConfirm({
      title: `Are you sure to remove List ${Source.title}?`,
      message: "List will be remove permanently",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this._requestSource = api.generateCancelToken();
          const response = await apiDeleteList(
            `/api/list/${Source.id}`,
            this._requestSource.token
          );
          const { data } = response;
          if (response.status === 200) {
            this.props.deleteList({
              newTask: data.lists
            });
            alertFloat({
              type: "success",
              content: data.message
            });
          }
        } catch (e) {
          const error = axiosError(e);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
          alertFloat({
            type: "error",
            content: error
          });
        }
      }
    });
  };

  render() {
    const { renamingTitle, renamingTitleName, isSubmitting } = this.state;
    const { columnSource } = this.props;
    return (
      <div className="d-flex flex-row flex-nowrap justify-content-between align-items-center pt-1 pl-1">
        {renamingTitle ? (
          <TextareaAutosize
            inputClassName="form-control"
            value={renamingTitleName}
            onTextChange={this.onTitleRenamingChange}
            onKeyPress={this.onTitleRenamingKeypress}
            onBlur={this.onTitleRenamingStop}
            disabled={isSubmitting}
            autoFocus
          />
        ) : (
          <h5 className="mb-0">{columnSource.title}</h5>
        )}
        <div>
          <UncontrolledDropdown tag="span">
            <DropdownToggle tag="button" className="btn btn-sm btn-icon">
              <i className="icofont-navigation-menu text-primary" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                tag="button"
                type="button"
                onClick={() => this.onTitleRenamingStart(columnSource)}
              >
                <i className="icofont-edit" /> Rename
              </DropdownItem>
              <DropdownItem
                tag="button"
                type="button"
                className="text-danger"
                onClick={() => this.onDeleteList(columnSource)}
              >
                <i className="icofont-bin" /> Remove
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    );
  }
}

export default FormEditTitleCard;
