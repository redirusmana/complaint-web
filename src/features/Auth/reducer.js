import { AUTH_SET_USER, AUTH_SET_LOGIN, AUTH_SET_LOGOUT } from "./action";

const initState = {
  user: {},
  token: "",
  type: ""
};

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AUTH_SET_USER:
      return {
        ...state,
        user: payload
      };
    case AUTH_SET_LOGIN:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        type: payload.type
      };
    case AUTH_SET_LOGOUT:
      return {
        ...state,
        user: initState.user,
        token: initState.token,
        type: initState.type
      };
    default:
      return state;
  }
};
