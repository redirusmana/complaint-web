import api from "../../provider/Tools/api";

export const AUTH_SET_USER = "AUTH_SET_USER";
export const AUTH_SET_LOGIN = "AUTH_SET_LOGIN";
export const AUTH_SET_LOGOUT = "AUTH_SET_LOGOUT";

export const apiLogin = "/api/auth/login";
export const apiSignIn = "/api/auth/register";

export const getSavedToken = () => {
  return window.localStorage.getItem("saved_token");
};

export const saveToken = token => {
  window.localStorage.setItem("saved_token", token);
};

export const removeToken = () => {
  window.localStorage.removeItem("saved_token");
};

export const apiLoginAction = (data, cancelToken) => {
  const url = `${apiLogin}`;
  return api.post(url, data, cancelToken);
};

export const apiSignInAction = (data, cancelToken) => {
  const url = `${apiSignIn}`;
  return api.post(url, data, cancelToken);
};
