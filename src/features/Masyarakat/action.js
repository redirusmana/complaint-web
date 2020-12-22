import api from "../../provider/Tools/api";

export const apiPersonsGet = "api/persons";
export const apiPersonsFilter = "api/persons/filter";
export const apiUsersGet = "api/users";

export const apiUsersStore = (data, cancelToken) => {
  const url = apiUsersGet;
  return api.post(url, data, cancelToken);
};
export const apiUsersUpdate = (userId, data, cancelToken) => {
  const url = `${apiUsersGet}/${userId}`;
  return api.post(url, data, cancelToken);
};

export const apiUsersDelete = (personsId, cancelToken) => {
  const url = `${apiUsersGet}/${personsId}`;
  return api.delete(url, cancelToken);
};

const PAGE_PERSONS_PREFIX = "/master-data/masyarakat";
export const PAGE_PERSONS_HOME = `${PAGE_PERSONS_PREFIX}`;
export const PAGE_PERSONS_CREATE = `${PAGE_PERSONS_PREFIX}/create`;
export const PAGE_PERSONS_EDIT = `${PAGE_PERSONS_PREFIX}/edit/:id`;
