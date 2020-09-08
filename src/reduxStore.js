import { createStore, applyMiddleware, compose, combineReducers } from "redux";

import reduxReducer from "./reduxReducer";

const rootReducer = combineReducers(reduxReducer);

const enhancers = [];
const middlewares = [];

if (process.env.NODE_ENV === "development") {
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window;

  if (typeof __REDUX_DEVTOOLS_EXTENSION__ === "function") {
    enhancers.push(__REDUX_DEVTOOLS_EXTENSION__());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);

export default () => {
  const store = createStore(rootReducer, composedEnhancers);
  return { store };
};
