import React from "react";
import get from "lodash/get";
import ChecklistCard from "./ChecklistCard";
import DescriptionCard from "./DescriptionCard";
import FileCard from "./FileCard";
import CommentCard from "./CommentCard";
import ActivityCard from "./ActivityCard";
import MemberCard from "./MemberCard";
import StatusCard from "./StatusCard";
import PriorityCard from "./PriorityCard";
import DeadlineCard from "./DeadlineCard";
import TitleCard from "./TitleCard";
import Modal from "../../../provider/Display/Modal";
import api from "../../../provider/Tools/api";
import { apiDeleteCard } from "../action";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";
import popConfirm from "../../../provider/Display/popConfirm";
import LoadingCard from "../../../provider/Display/LoadingCard";
import "../Style/style.css";

class CardPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, dataSources: {} };
  }

  onTaskClosed = () => {
    const { history, match } = this.props;
    this.props.getBoardInfo();
    history.replace(`/board/${match.params.id}`);
  };

  componentDidMount() {
    this.getCardInfo();
  }

  getCardInfo = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        const { match } = this.props;
        const ROUTE_API = `api/card/${match.params.cardId}`;
        this._requestSource = api.generateCancelToken();
        api
          .get(ROUTE_API, this._requestSource.token)
          .then(response => {
            const { data } = response;
            this.setState({
              dataSources: data,
              loading: false
            });
          })
          .catch(error => {
            console.log(error);
            const { history } = this.props;
            history.replace(`/board/${match.params.id}`);
            alertFloat({
              type: "error",
              content: "Card is not found"
            });
          });
      }
    );
  };

  handleDeleteCard = idCard => {
    popConfirm({
      title: `Are you sure to remove this Card?`,
      message: "Card will deleted on Lists",
      okText: " Yes",
      okType: "danger",
      cancelText: " No",
      onOkay: async () => {
        try {
          this._requestSource = api.generateCancelToken();
          const response = await apiDeleteCard(
            `/api/card/${idCard}`,
            this._requestSource.token
          );
          const { data } = response;
          if (response.status === 200) {
            alertFloat({
              type: "success",
              content: data.message
            });
            const { history } = this.props;
            const { match } = this.props;
            history.replace(`/board/${match.params.id}`);
            this.props.getBoardInfo();
          }
        } catch (err) {
          const error = axiosError(err);
          if (error === AXIOS_CANCEL_MESSAGE) {
            return;
          }
        }
      },
      onCancel: () => {}
    });
  };

  handleReplaceDesc = newDesc => {
    const { dataSources } = this.state;
    this.setState({
      dataSources: {
        ...dataSources,
        description: newDesc
      }
    });
  };

  handleReplaceActivities = ({ newActivities }) => {
    this.setState(prevState => {
      const result = {
        dataSources: {
          ...prevState.dataSources,
          activities: [newActivities, ...prevState.dataSources.activities]
        }
      };
      return result;
    });
  };

  handleAddChecklist = newChecklists => {
    this.setState(prevState => {
      const result = {
        dataSources: {
          ...prevState.dataSources,
          checklists: [newChecklists, ...prevState.dataSources.checklists]
        }
      };
      return result;
    });
  };

  handleAddChildChecklist = newChild => {
    this.setState(prevState => {
      const newList = prevState.dataSources.checklists.map(list => {
        if (list.id !== newChild.parent_id) return list;

        return {
          ...list,
          childs: [...list.childs, newChild]
        };
      });
      return {
        dataSources: {
          ...prevState.dataSources,
          checklists: newList
        }
      };
    });
  };

  renameChecklist = newCheck => {
    this.setState(prevState => {
      const newList = prevState.dataSources.checklists.map(list => {
        if (newCheck.id === list.id) {
          return {
            ...list,
            ...newCheck
          };
        }
        return list;
      });

      return {
        dataSources: {
          ...prevState.dataSources,
          checklists: newList
        }
      };
    });
  };

  renameChildChecklist = newCheck => {
    this.setState(prevState => {
      const newList = prevState.dataSources.checklists.find(
        list => list.id === newCheck.parent_id
      );
      const newChecks = newList.childs.map(li => {
        if (newCheck.id === li.id) {
          return {
            ...li,
            ...newCheck
          };
        }
        return li;
      });

      const newChecklists = prevState.dataSources.checklists.map(checklist => {
        if (checklist.id !== newCheck.parent_id) return checklist;

        return {
          ...checklist,
          childs: [...newChecks]
        };
      });

      return {
        dataSources: {
          ...prevState.dataSources,
          checklists: newChecklists
        }
      };
    });
  };

  deleteChecklists = newChecklists => {
    this.setState(prevState => {
      const newList = prevState.dataSources.checklists.filter(
        list => list.id !== newChecklists.id
      );
      return {
        dataSources: {
          ...prevState.dataSources,
          checklists: newList
        }
      };
    });
  };

  deleteChildChecklists = newChildChecklists => {
    this.setState(prevState => {
      const newList = prevState.dataSources.checklists.map(list => {
        if (list.id !== newChildChecklists.parent_id) return list;

        return {
          ...list,
          childs: [
            ...list.childs.filter(child => child.id !== newChildChecklists.id)
          ]
        };
      });
      return {
        dataSources: {
          ...prevState.dataSources,
          checklists: newList
        }
      };
    });
  };

  handleChangeAttachments = newAttachments => {
    this.setState(prevState => {
      const result = {
        dataSources: {
          ...prevState.dataSources,
          attachments: [...newAttachments, ...prevState.dataSources.attachments]
        }
      };
      return result;
    });
  };

  deleteAttachments = newAttachments => {
    this.setState(prevState => {
      const newList = prevState.dataSources.attachments.filter(
        list => list.id !== newAttachments.id
      );
      return {
        dataSources: {
          ...prevState.dataSources,
          attachments: newList
        }
      };
    });
  };

  handleAddMemberCard = newMembers => {
    this.setState(prevState => {
      const result = {
        dataSources: {
          ...prevState.dataSources,
          members: [...newMembers, ...prevState.dataSources.members]
        }
      };
      return result;
    });
  };

  renderCard() {
    const { loading, dataSources } = this.state;
    const { loadingProps } = this.props;
    if (loadingProps || loading) {
      return (
        <div className="task-detail d-flex align-items-center">
          <LoadingCard />
        </div>
      );
    }
    return (
      <div className="task-detail">
        <div className="task-detail-main">
          <div className="task-detail-header">
            <section className="task-detail-group">
              <i
                className="icofont-paperclip "
                style={{ fontSize: "1.2rem" }}
              />
              <div className="flex-fill">
                <TitleCard
                  cardId={dataSources.id}
                  titles={dataSources.title}
                  handleReplace={this.handleReplaceActivities}
                />
                <div className="task-detail-meta">
                  <span>
                    In{" "}
                    <strong className="text-primary">
                      {get(dataSources, "category_list.title", "")}
                    </strong>{" "}
                    Created by{" "}
                  </span>
                  <strong className="text-primary">
                    {dataSources.created_by || "Redi rusmana"}{" "}
                  </strong>
                  {dataSources.created_at || ""}
                </div>
                <div className="task-detail-tags">
                  <StatusCard
                    cardId={dataSources.id}
                    stats={dataSources.status}
                    handleReplace={this.handleReplaceActivities}
                  />
                  <PriorityCard
                    cardId={dataSources.id}
                    prioritys={dataSources.priority}
                    handleReplace={this.handleReplaceActivities}
                  />
                  <DeadlineCard
                    cardId={dataSources.id}
                    due_dates={dataSources.due_date}
                    handleReplace={this.handleReplaceActivities}
                  />
                </div>
              </div>
              <div style={{ flex: 0 }}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => this.handleDeleteCard(dataSources.id)}
                >
                  <i className="icofont-bin " /> Remove
                </button>
              </div>
            </section>
          </div>
          <div className="task-detail-body">
            <DescriptionCard
              cardId={dataSources.id}
              descriptions={dataSources.description}
              handleReplaceDesc={this.handleReplaceDesc}
              handleReplace={this.handleReplaceActivities}
            />
            <ChecklistCard
              cardId={dataSources.id}
              checks={dataSources.checklists}
              handleAddChecklist={this.handleAddChecklist}
              handleAddChildChecklist={this.handleAddChildChecklist}
              renameChecklist={this.renameChecklist}
              renameChildChecklist={this.renameChildChecklist}
              deleteChecklists={this.deleteChecklists}
              deleteChildChecklists={this.deleteChildChecklists}
              handleReplace={this.handleReplaceActivities}
            />
            <FileCard
              attachments={dataSources.attachments}
              handleChangeAttachments={this.handleChangeAttachments}
              deleteAttachments={this.deleteAttachments}
              cardId={dataSources.id}
              handleReplace={this.handleReplaceActivities}
            />
          </div>
          <div className="task-detail-footer">
            <MemberCard
              members={dataSources.members}
              cardId={dataSources.id}
              handleAddMemberCard={this.handleAddMemberCard}
              handleReplace={this.handleReplaceActivities}
            />
          </div>
        </div>
        <div className="task-detail-aside">
          <ActivityCard dataSource={dataSources} />
          <CommentCard
            cardId={dataSources.id}
            comments={dataSources.comments}
            handleReplace={this.handleReplaceActivities}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          visible={true}
          size="large"
          handleBack={this.onTaskClosed}
          afterClose={this.getCardInfo}
          wrapClassName="task-modal-wrapper"
          showTitle={false}
          closeOnOutside={false}
        >
          {this.renderCard()}
        </Modal>
      </React.Fragment>
    );
  }
}

export default CardPage;
