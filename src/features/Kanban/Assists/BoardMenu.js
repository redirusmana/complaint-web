import React from "react";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import get from "lodash/get";
import ListSearch from "../../Profile/Components/ListSearch";
import "../Style/style.css";

class BoardMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }

  handleSearch = isSearch => {
    this.setState({
      search: isSearch
    });
  };

  render() {
    // , user
    const { data, history } = this.props;
    console.log(history);
    const { search } = this.state;

    const filteredFriend =
      Array.isArray(get(data, "boards")) && get(data, "boards").length > 0
        ? get(data, "boards").filter(board => {
            return (
              board.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
            );
          })
        : [];

    // handleGo = (id) => {
    //   history.replace(`/board/${id}`);
    // };

    // const listBoards = filteredFriend.map(result => (
    //   <React.Fragment key={`list-board-dropdown-${result.id}`}>
    //     <div
    //       // to={`/board/${result.id}`}
    //       className="p-2 text-dark pointer hovered-button-popover pointer "
    //     >
    //       {/* name */}
    //       {/* `${result.title} - ${result.created_by}` */}
    //       {result.created_by === user.username && result.title}
    //     </div>
    //   </React.Fragment>
    // ));

    // const listBoard = filteredFriend.map(result => (
    //   <React.Fragment key={`list-board-dropdown-${result.id}`}>
    //     <div
    //       // to={`/board/${result.id}`}
    //       className="p-2 text-dark pointer hovered-button-popover pointer "
    //     >
    //       {/* `${result.title} - ${result.created_by}` */}
    //       <b>{result.created_by !== user.username && result.title}</b>
    //     </div>
    //   </React.Fragment>
    // ));

    const listBoard = filteredFriend.map(result => (
      <React.Fragment key={`list-board-dropdown-${result.id}`}>
        <div
          // to={`/board/${result.id}`}
          // onClick={() => {
          //   this.handleGo(result.id);
          // }}
          onClick={() => {
            history.push(`/board/${result.id}`);
          }}
          className="p-2 text-dark pointer hovered-button-popover pointer "
        >
          {/* `${result.title} - ${result.created_by}` */}
          <b>{result.title}</b>
        </div>
      </React.Fragment>
    ));

    return (
      <React.Fragment>
        <div className="mb-2 m-3">
          <ListSearch
            placeholder="Search Board"
            beginSearch={this.handleSearch}
          />
        </div>
        {listBoard}
        {/* <div className="d-flex flex-column my-2 px-0">
          <h5 className="mx-auto font-weight-bold">Your Board</h5>
          {listBoards}
        </div>
        <div className="d-flex flex-column my-2 px-0">
          <h5 className="mx-auto font-weight-bold">Other Board</h5>
          {listBoard}
        </div> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});
export default connect(mapStateToProps)(BoardMenu);
