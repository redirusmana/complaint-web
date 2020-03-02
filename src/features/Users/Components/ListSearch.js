import React from "react";
import InputSearch from "../../../provider/Commons/InputSearch";
import InputSelectLong from "../../../provider/Commons/InputSelectLong";
import "../Style/style.css";

class ListSearch extends React.PureComponent {
  onSortChange = value => {
    this.setState({
      sort: value
    });
  };
  render() {
    return (
      <React.Fragment>
        <div className="col-lg-18 mb-3 ">
          <InputSearch
            initialSearch={""}
            placeholder="Search Friend"
            // onSearchChange={value => this.beginSearch(value)}
            autoFocus={!!"title"}
          />
        </div>
        <div className="col-lg-6 mb-3">
          <InputSelectLong
            className="form-control"
            name="sort"
            onChange={value => this.onSortChange("sort", value)}
            options={[
              { label: "A - Z", value: "asc" },
              { label: "Z - A", value: "desc" },
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" }
            ]}
            placeholder="Sort"
            // value={}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default ListSearch;
