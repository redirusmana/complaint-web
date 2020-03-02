import React from "react";
import get from "lodash/get";
import Avatar from "../../../provider/Display/Avatar";
import FileIcon from "../../../provider/Display/FileIcon";
import { dateFromNowString } from "../../../provider/Tools/converter";
import { assetsApiUrl } from "../../../provider/Tools/general";
import moment from "moment";

class ActivityCard extends React.PureComponent {
  render() {
    const { dataSource } = this.props;

    const mappedActivity =
      Array.isArray(get(dataSource, "activities")) &&
      get(dataSource, "activities").length > 0
        ? get(dataSource, "activities").map(result => {
            let badge1 = null;
            let badge2 = null;
            let badge3 = null;
            let badge4 = null;

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
              <React.Fragment key={`list-activity-on-card-${result.id}`}>
                <div className="media task-detail-activity">
                  <Avatar
                    name={get(result, "user.name")}
                    image={
                      get(result, "user.avatar_path")
                        ? assetsApiUrl(get(result, "user.avatar_path"))
                        : undefined
                    }
                    title={get(result, "user.name")}
                    avatarClass="avatar-link mx-1 my-0"
                  />
                  <div className="media-body pl-1 align-self-center">
                    <div className="activity-item-header">
                      <div>
                        <small>
                          <b className="font-weight-bold">
                            {get(result, "user.name")}
                          </b>{" "}
                          {result.event}
                        </small>
                      </div>
                      <div>
                        <small>{dateFromNowString(result.created_at)}</small>
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
                                      <b>
                                        "{get(result, "after.description")}"
                                      </b>
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
                                        className={`w-100 badge badge-${badge2} mt-1`}
                                      >
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
                                      <b>Updated</b> Status{" "}
                                      <span
                                        className={`w-100 badge badge-${badge1} mb-1`}
                                      >
                                        <del>
                                          {get(result, "before.status")}
                                        </del>
                                      </span>
                                      <span
                                        className={`w-100 badge badge-${badge2} mt-1`}
                                      >
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
                                        className={`w-100 badge badge-${badge4} mt-1`}
                                      >
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
                                        className={`w-100 badge badge-${badge3} mb-1`}
                                      >
                                        <del>
                                          {get(result, "before.priority")}
                                        </del>
                                      </span>
                                      <span
                                        className={`w-100 badge badge-${badge4} mt-1`}
                                      >
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
        : [];
    return (
      <React.Fragment>
        <div className="task-detail-aside-header">
          <div className="task-detail-aside-title">
            <div className="d-flex align-items-center justify-content-center">
              <div className="mx-auto">
                {/* <button
                  type="button"
                  className="btn btn-md btn-link text-primary"
                > */}
                <i className="icofont-flag" />
                Activity
                {/* </button> */}
              </div>
              {/* <div className="mx-auto">
                <button
                  type="button"
                  className="btn btn-md btn-link text-primary"
                >
                  <i className="icofont-comment" />
                  Comment
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="task-detail-aside-body">{mappedActivity}</div>
      </React.Fragment>
    );
  }
}

export default ActivityCard;
