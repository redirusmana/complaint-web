import api from "../../provider/Tools/api";

export const API_PREFIX_PROFILE = "/api/profile";
export const API_PREFIX_BOARD = "/api/board";
export const API_PREFIX_FRIEND = "/api/friend";
export const API_ADD_FRIEND = "/api/";

export const apiEditProfile = (data, cancelToken) => {
  const url = `${API_PREFIX_PROFILE}`;
  return api.post(url, data, cancelToken);
};

export const apiCreateBoard = (data, cancelToken) => {
  const url = `${API_PREFIX_BOARD}`;
  return api.post(url, data, cancelToken);
};

export const apiUpdateBoard = (data, id, cancelToken) => {
  const url = `${API_PREFIX_BOARD}/${id}`;
  return api.put(url, data, cancelToken);
};

export const apiFoundFriend = (data, cancelToken) => {
  const url = `${API_PREFIX_FRIEND}/add`;
  return api.post(url, data, cancelToken);
};

export const apiDeleteFriend = (url, data, cancelToken) => {
  return api.delete(url, data, cancelToken);
};

export const apiAcceptFriend = (url, cancelToken) => {
  return api.post(url, cancelToken);
};

export const apiDeclineFriend = (url, cancelToken) => {
  return api.delete(url, cancelToken);
};
