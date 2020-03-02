import React from "react";
import { Route } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import { Link } from "react-router-dom";
import TaskList from "../Components/TaskList";
import FormAddCard from "../Assists/FormAddCard";
import FormAddListTask from "../Assists/FormAddListTask";
import FormEditTitleCard from "../Assists/FormEditTitleCard";
import CardPage from "../Components/CardPage";
import api from "../../../provider/Tools/api";
import LoadingCard from "../../../provider/Display/LoadingCard";

class KanbanPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSources: {},
      loading: false
    };
  }

  componentDidMount() {
    this.getBoardInfo();
  }

  getBoardInfo = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        const { match } = this.props;
        const ROUTE_API = `api/board/${match.params.id}`;
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
          .catch(error => console.log(error));
      }
    );
  };

  // onCellClick = (e, cell) => {
  //   console.log(e, cell);
  // };

  addTask = ({ newTask, columnIndex }) => {
    this.setState(prevState => {
      const newList = prevState.dataSources.lists.map((list, li) => {
        if (columnIndex !== li) return list;

        return {
          ...list,
          cards: [...list.cards, newTask]
        };
      });

      return {
        dataSources: {
          ...prevState.dataSources,
          lists: newList
        }
      };
    });
  };

  addTaskCard = ({ newTask }) => {
    this.setState(prevState => {
      const result = {
        dataSources: {
          ...prevState.dataSources,
          lists: [...prevState.dataSources.lists, newTask]
        }
      };
      return result;
    });
  };

  renameList = ({ newTask, columnIndex }) => {
    this.setState(prevState => {
      const newList = prevState.dataSources.lists.map((list, li) => {
        if (columnIndex === li) {
          return {
            ...list,
            ...newTask
          };
        }
        return list;
      });

      return {
        dataSources: {
          ...prevState.dataSources,
          lists: newList
        }
      };
    });
  };

  deleteList = ({ newTask, columnIndex }) => {
    this.setState(prevState => {
      const newList = newTask.filter((list, li) => columnIndex !== li);

      return {
        dataSources: {
          ...prevState.dataSources,
          lists: newList
        }
      };
    });
  };

  render() {
    const { dataSources, loading } = this.state;

    if (loading) {
      return <LoadingCard />;
    }

    return (
      <React.Fragment>
        <div className="kanban-board">
          <Container
            orientation="horizontal"
            dragHandleSelector=".kanban-draggable-header"
          >
            {Array.isArray(dataSources.lists) && dataSources.lists.length > 0
              ? dataSources.lists.map((column, columnIndex) => (
                  <Draggable key={`column-id-${column.id}`}>
                    <div className="kanban-column">
                      <div className="kanban-column-header">
                        <FormEditTitleCard
                          columnSource={column}
                          renameList={this.renameList}
                          columnIndex={columnIndex}
                          deleteList={this.deleteList}
                        />
                      </div>
                      <div className="kanban-column-body">
                        <Container
                          groupName="col"
                          onDragStart={this.onDragStart}
                          onDragEnd={this.onDragEnd}
                          dropClass="kanban-card-ghost-drop"
                          dragClass="kanban-card-ghost"
                        >
                          {column.cards.map(cell => {
                            return (
                              <Draggable key={`cards-id-${cell.id}`}>
                                <Link
                                  // onClick={e => this.onCellClick(e, cell)}
                                  to={`/board/${dataSources.id}/card/${cell.id}`}
                                  role="presentation"
                                  className={"kanban-cell"} //  disable-pointer
                                >
                                  <div className="kanban-cell-body">
                                    <TaskList task={cell} />
                                  </div>
                                </Link>
                              </Draggable>
                            );
                          })}
                        </Container>
                      </div>
                      <div className="kanban-column-footer">
                        <FormAddListTask
                          listSource={column}
                          addTask={this.addTask}
                          columnIndex={columnIndex}
                        />
                      </div>
                    </div>
                  </Draggable>
                ))
              : []}

            <div className="kanban-column-creator">
              <div className="kanban-column">
                <FormAddCard
                  idBoard={dataSources.id}
                  addTaskCard={this.addTaskCard}
                />
              </div>
            </div>
          </Container>
          <Route
            path="/board/:id/card/:cardId"
            exact
            render={routeProps => (
              <CardPage
                {...routeProps}
                loadingProps={loading}
                getBoardInfo={this.getBoardInfo}
              />
            )}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default KanbanPage;
