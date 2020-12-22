import api from "../../provider/Tools/api";

export const apiOfficersGet = "api/officers";
export const apiOfficersFilter = "api/officers/filter";
export const apiUsersGet = "api/users";

export const apiUsersStore = (data, cancelToken) => {
  const url = apiUsersGet;
  return api.post(url, data, cancelToken);
};
export const apiUsersUpdate = (userId, data, cancelToken) => {
  const url = `${apiUsersGet}/${userId}`;
  return api.post(url, data, cancelToken);
};

export const apiUsersDelete = (officersId, cancelToken) => {
  const url = `${apiUsersGet}/${officersId}`;
  return api.delete(url, cancelToken);
};

const PAGE_OFFICERS_PREFIX = "/master-data/petugas";
export const PAGE_OFFICERS_HOME = `${PAGE_OFFICERS_PREFIX}`;
export const PAGE_OFFICERS_CREATE = `${PAGE_OFFICERS_PREFIX}/create`;
export const PAGE_OFFICERS_EDIT = `${PAGE_OFFICERS_PREFIX}/edit/:id`;
