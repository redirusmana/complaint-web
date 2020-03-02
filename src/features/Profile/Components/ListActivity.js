import React from "react";
import { Empty } from "antd";
import moment from "moment";
// import cn from "classnames";
import FileIcon from "../../../provider/Display/FileIcon";
import Avatar from "../../../provider/Display/Avatar";
import { dateFromNowString } from "../../../provider/Tools/converter";
import get from "lodash/get";
import LoadingCard from "../../../provider/Display/LoadingCard";
import api from "../../../provider/Tools/api";
import { assetsApiUrl } from "../../../provider/Tools/general";

class ListActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 10,
      loadingState: false
    };
  }

  componentDidMount() {
    this.getActivities();
  }

  getActivities = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        this._requestSource = api.generateCancelToken();
        api
          .get(`/api/profile/activities`, this._requestSource.token, {
            params: {
              limit: this.state.page
            }
          })
          .then(response => {
            const { data } = response;
            this.setState({
              dataSources: data.data,
              page: data.limit,
              loading: false
            });
          })
          .catch(error => console.log(error));
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      prevState => ({
        loadingState: true,
        page: prevState.page + 10
      }),
      () => {
        this._requestSource = api.generateCancelToken();
        api
          .get(`/api/profile/activities`, this._requestSource.token, {
            params: {
              limit: this.state.page
            }
          })
          .then(response => {
            const { data } = response;
            this.setState({
              loadingState: false,
              dataSources: data.data,
              page: data.limit
            });
          })
          .catch(error => console.log(error));
      }
    );
  };

  // cnBgClass = index => {
  //   return cn({
  //     "bg-light": index % 2 === 1
  //   });
  // };

  render() {
    const { loadingState, loading, dataSources } = this.state;

    const ListActivities =
      Array.isArray(dataSources) && dataSources.length > 0 ? (
        dataSources.map(result => {
          let badge1 = null;
          let badge2 = null;
          let badge3 = null;
          let badge4 = null;

          const inCard =
            get(result, "after.depends.title") ||
            get(result, "before.depends.title") ? (
              <React.Fragment>
                - In Card{" "}
                <b className="font-weight-bold">
                  {get(result, "after.depends.title") ||
                    get(result, "before.depends.title")}
                </b>
              </React.Fragment>
            ) : (
              ""
            );

          const inList =
            get(result, "after.depends.depends.title") ||
            get(result, "before.depends.depends.title") ? (
              <React.Fragment>
                - In List{" "}
                <b className="font-weight-bold">
                  {get(result, "after.depends.depends.title") ||
                    get(result, "before.depends.depends.title")}
                </b>
              </React.Fragment>
            ) : (
              ""
            );

          const onBoard =
            get(result, "after.depends.depends.depends.title") ||
            get(result, "before.depends.depends.depends.title") ? (
              <React.Fragment>
                - on Board{" "}
                <b className="font-weight-bold">
                  {get(result, "after.depends.depends.depends.title") ||
                    get(result, "before.depends.depends.depends.title")}
                </b>
              </React.Fragment>
            ) : (
              ""
            );
          if (get(result, "before.status") === "Not Started") {
            badge1 = "info";
          } else if (get(result, "before.status") === "In Progress") {
            badge1 = "primary";
          } else if (get(result, "before.status") === "Delayed") {
            badge1 = "warning";
          } else if (get(result, "before.status") === "Done") {
            badge1 = "success";
          } else if (get(result, "before.status") === "Dropped") {
            badge1 = "danger";
          }

          if (get(result, "after.status") === "Not Started") {
            badge2 = "info";
          } else if (get(result, "after.status") === "In Progress") {
            badge2 = "primary";
          } else if (get(result, "after.status") === "Delayed") {
            badge2 = "warning";
          } else if (get(result, "after.status") === "Done") {
            badge2 = "success";
          } else if (get(result, "after.status") === "Dropped") {
            badge2 = "danger";
          }

          if (get(result, "before.priority") === "Low Priority") {
            badge3 = "success";
          } else if (get(result, "before.priority") === "Medium Priority") {
            badge3 = "warning";
          } else if (get(result, "before.priority") === "High Priority") {
            badge3 = "danger";
          }

          if (get(result, "after.priority") === "Low Priority") {
            badge4 = "success";
          } else if (get(result, "after.priority") === "Medium Priority") {
            badge4 = "warning";
          } else if (get(result, "after.priority") === "High Priority") {
            badge4 = "danger";
          }

          return (
            <React.Fragment
              key={`list-activitys-${result.id}-${result.historiable_id}`}
            >
              <div className={`media `}>
                <Avatar
                  size="md"
                  name={get(result, "user.name")}
                  title={get(result, "user.name")}
                  image={
                    get(result, "user.avatar_path")
                      ? assetsApiUrl(get(result, "user.avatar_path"))
                      : undefined
                  }
                  avatarClass="avatar-link m-1"
                />
                <div
                  className="media-body pl-1 align-self-center"
                  style={{ fontSize: "16px" }}
                >
                  <div className="activity-item-header">
                    <div>
                      <small>
                        <b className="font-weight-bold">
                          {get(result, "user.name")}
                        </b>{" "}
                        {result.event}{" "}
                        {result.attribute === "card" ? "" : result.attribute}
                      </small>
                    </div>
                    <div>
                      <small className="font-weight-light">
                        {dateFromNowString(result.created_at)} {inCard} {inList}{" "}
                        {onBoard}
                      </small>
                    </div>
                  </div>
                  <div className="card activity-card">
                    <div className="card-body">
                      {result.event === "has created new" && (
                        <small>
                          {result.event} <b>{get(result, "after.title")}</b>{" "}
                          {/* Card */}
                        </small>
                      )}

                      {result.event === "added new checklist" && (
                        <small>
                          {result.event} <b>{get(result, "after.title")}</b>{" "}
                          {/* Checklist */}
                        </small>
                      )}

                      {result.event === "has added" && (
                        <React.Fragment>
                          {result.attribute === "attachment" && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column"
                              }}
                            >
                              <small>New Attachments :</small>
                              {get(result, "after.attachment").map(attach => {
                                return (
                                  <div
                                    style={{ display: "flex", margin: 5 }}
                                    key={`list-attach-card-${attach.owner_id}-${attach.id}`}
                                  >
                                    <FileIcon
                                      fileName={attach.filename}
                                      title={attach.filename}
                                      size="sm"
                                    />
                                    <b
                                      style={{
                                        textAlgin: "left",
                                        margin: "auto 0",
                                        fontSize: 12
                                      }}
                                    >
                                      {attach.filename}
                                    </b>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {result.attribute === "member" && (
                            <div style={{ display: "flex" }}>
                              {get(result, "after").map(member => (
                                <Avatar
                                  size="sm"
                                  name={member.name}
                                  title={member.name}
                                  image={
                                    member.avatar_path
                                      ? assetsApiUrl(member.avatar_path)
                                      : undefined
                                  }
                                  avatarClass="avatar-link m-1"
                                  key={`list-member-card-${member.id}-${member.role}`}
                                />
                              ))}
                            </div>
                          )}
                        </React.Fragment>
                      )}

                      {result.event === "has updated" && (
                        <React.Fragment>
                          <div>
                            {get(result, "before.title") &&
                              get(result, "after.title") && (
                                <div>
                                  <small>
                                    <b>Updated</b> Title Card
                                    <br />
                                    From :{" "}
                                    <del>{get(result, "before.title")}</del>
                                    <br />
                                    To :{" "}
                                    <b className="pt-2">
                                      {get(result, "after.title")}
                                    </b>
                                    <br />
                                  </small>
                                </div>
                              )}
                          </div>
                        </React.Fragment>
                      )}

                      {result.event === "has updated card" && (
                        <React.Fragment>
                          <div>
                            {get(result, "before.title") &&
                              get(result, "after.title") && (
                                <div>
                                  <small>
                                    <b>Updated</b> Title Card
                                    <br />
                                    From :{" "}
                                    <del>{get(result, "before.title")}</del>
                                    <br />
                                    To :{" "}
                                    <b className="pt-2">
                                      {get(result, "after.title")}
                                    </b>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.description") === null &&
                              get(result, "after.description") && (
                                <div>
                                  <small>
                                    <b>Added</b> description{" "}
                                    <b>"{get(result, "after.description")}"</b>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.description") &&
                              get(result, "after.description") && (
                                <div>
                                  <small>
                                    <b>Updated</b> Description <br />
                                    From :{" "}
                                    <del>
                                      {get(result, "before.description")}
                                    </del>
                                    <br />
                                    To :{" "}
                                    <b className="pt-2">
                                      {get(result, "after.description")}
                                    </b>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.due_date") === null &&
                              get(result, "after.due_date") && (
                                <div>
                                  <small>
                                    <b>Added</b> Due Date <br />
                                    <b>
                                      "
                                      {moment(
                                        get(result, "after.due_date")
                                      ).format("YYYY-MM-DD")}
                                      "
                                    </b>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.due_date") &&
                              get(result, "after.due_date") && (
                                <div>
                                  <small>
                                    <b>Updated</b> Due Date <br />
                                    From :{" "}
                                    <del>
                                      {moment(
                                        get(result, "before.due_date")
                                      ).format("YYYY-MM-DD")}
                                    </del>
                                    <br />
                                    To :{" "}
                                    <b className="pt-2">
                                      {moment(
                                        get(result, "after.due_date")
                                      ).format("YYYY-MM-DD")}
                                    </b>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.status") === null &&
                              get(result, "after.status") && (
                                <div>
                                  <small>
                                    <b>Added</b> Status{" "}
                                    <span
                                      className={` badge badge-${badge2} mt-1`}
                                    >
                                      {/* w-100 */}
                                      {get(result, "after.status")}
                                    </span>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.status") &&
                              get(result, "after.status") && (
                                <div>
                                  <small>
                                    <b>Updated</b> Status <br />
                                    <span
                                      className={` badge badge-${badge1} mb-1`}
                                    >
                                      {/* w-100 */}
                                      <del>{get(result, "before.status")}</del>
                                    </span>
                                    <br />
                                    <span
                                      className={` badge badge-${badge2} mt-1`}
                                    >
                                      {/* w-100 */}
                                      {get(result, "after.status")}
                                    </span>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.priority") === null &&
                              get(result, "after.priority") && (
                                <div>
                                  <small>
                                    <b>Added</b> Priority{" "}
                                    <span
                                      className={` badge badge-${badge4} mt-1`}
                                    >
                                      {/* w-100 */}
                                      {get(result, "after.priority")}
                                    </span>
                                    <br />
                                  </small>
                                </div>
                              )}

                            {get(result, "before.priority") &&
                              get(result, "after.priority") && (
                                <div>
                                  <small>
                                    <b>Updated</b> Priority{" "}
                                    <span
                                      className={` badge badge-${badge3} mb-1`}
                                    >
                                      {/* w-100 */}
                                      <del>
                                        {get(result, "before.priority")}
                                      </del>
                                    </span>
                                    <span
                                      className={` badge badge-${badge4} mt-1`}
                                    >
                                      {/* w-100 */}
                                      {get(result, "after.priority")}
                                    </span>
                                    <br />
                                  </small>
                                </div>
                              )}
                          </div>
                        </React.Fragment>
                      )}

                      {result.event === "updated checklist" && (
                        <React.Fragment>
                          <div>
                            {get(result, "after.is_checked") === true && (
                              <div>
                                <small>
                                  Checked Checklist{" "}
                                  <b className="pt-2">
                                    {get(result, "after.attribute.title")}
                                  </b>
                                  <br />
                                </small>
                              </div>
                            )}
                            {get(result, "before.is_checked") === true && (
                              <div>
                                <small>
                                  unChecked Checklist{" "}
                                  <b className="pt-2">
                                    {get(result, "after.attribute.title")}
                                  </b>
                                  <br />
                                </small>
                              </div>
                            )}
                            {get(result, "before.title") !== null &&
                              get(result, "after.title") && (
                                <div>
                                  <small>
                                    <b>Renamed</b> Checklist <br />
                                    From :{" "}
                                    <del>{get(result, "before.title")}</del>
                                    <br />
                                    To :{" "}
                                    <b className="pt-2">
                                      {get(result, "after.title")}
                                    </b>
                                    <br />
                                  </small>
                                </div>
                              )}
                          </div>
                        </React.Fragment>
                      )}

                      {result.event === "has deleted" && (
                        <small>
                          {result.event} {result.attribute}{" "}
                          <b>{get(result, "before.title")}</b>{" "}
                          {result.attribute === "attachment" && (
                            <div style={{ display: "flex", margin: 5 }}>
                              <FileIcon
                                fileName={get(result, "before.filename")}
                                title={get(result, "before.filename")}
                                size="sm"
                              />
                              <b
                                style={{
                                  textAlgin: "left",
                                  margin: "auto 0",
                                  fontSize: 12
                                }}
                              >
                                {get(result, "before.filename")}
                              </b>
                            </div>
                          )}
                        </small>
                      )}

                      {result.event === "has commented" && (
                        <small>{get(result, "after.comment")}</small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
      ) : (
        <React.Fragment>
          <div className="col-lg-24 text-center ">
            <Empty description={"Activity is Not Found"} />
          </div>
        </React.Fragment>
      );

    if (loading) {
      return <LoadingCard />;
    }

    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <h5>
                <i className="icofont-listine-dots" /> Activity
              </h5>
              <hr />

              {ListActivities}
              {loadingState && <LoadingCard />}
            </div>
            <div className="card-footer ">
              {ListActivities.length >= 9 &&
                this.state.page <= ListActivities.length && (
                  <button
                    type="button"
                    className="btn btn-link text-dark"
                    onClick={() => this.handleLoadMore()}
                  >
                    <u>Load More...</u>
                  </button>
                )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ListActivity;
