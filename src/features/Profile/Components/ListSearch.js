import React from "react";
import InputSearch from "../../../provider/Commons/InputSearch";
import "../Style/style.css";

class ListSearch extends React.PureComponent {
  onSortChange = value => {
    this.setState({
      sort: value
    });
  };
  render() {
    const {placeholder} = this.props;
    return (
      <React.Fragment>
        <div className="col-lg-24 mb-3 ">
          <InputSearch
            initialSearch=""
            placeholder={placeholder}
            onSearchChange={value => this.props.beginSearch(value)}
            // autoFocus={!!"title"}
          />
        </div>
        {/* <div className="col-lg-6 mb-3">
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
        </div> */}
      </React.Fragment>
    );
  }
}

export default ListSearch;
