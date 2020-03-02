import api from "../../provider/Tools/api";

export const API_GET_BOARD_INDEX = "";
export const API_PREFIX_PROFILE = "/api/profile";
export const API_PREFIX_BOARD = "/api/board";
export const API_PREFIX_FRIEND = "/api/friend";

export const apiInviteFriend = (data, cancelToken) => {
  const url = `${API_PREFIX_FRIEND}/add`;
  return api.post(url, data, cancelToken);
};

export const apiInvitetoBoard = (data, id, cancelToken) => {
  const url = `${API_PREFIX_BOARD}/${id}/invite`;
  return api.post(url, data, cancelToken);
};

export const apiInvitetoCard = (data, idCard, cancelToken) => {
  const url = `api/card/${idCard}/member`;
  return api.post(url, data, cancelToken);
};

export const apiDeleteList = (url, data, cancelToken) => {
  return api.delete(url, data, cancelToken);
};

export const apiDeleteCard = (url, cancelToken) => {
  return api.delete(url, cancelToken);
};

export const storeComment = (data, idCard, cancelToken) => {
  const url = `/api/comment/card/${idCard}`;
  return api.post(url, data, cancelToken);
};

export const downloadDSFile = (id, cancelToken) => {
  const url = `/api/decision-support/file/${id}`;
  return api.get(url, cancelToken, {
    responseType: "blob"
  });
};
