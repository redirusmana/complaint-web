import api from "../../provider/Tools/api";

export const apiComplaintsGet = "api/complaints";
export const apiComplaintsFilter = "api/complaints/filter";
export const apiPersonsFilter = "api/persons/filter";
export const apiComplaintsDropdown = "api/persons/dropdown";

export const apiComplaintsStore = (data, cancelToken) => {
  const url = apiComplaintsGet;
  return api.post(url, data, cancelToken);
};

export const apiComplaintsUpdate = (userId, data, cancelToken) => {
  const url = `${apiComplaintsGet}/${userId}`;
  return api.post(url, data, cancelToken);
};

export const apiComplaintsDelete = (complaintsId, cancelToken) => {
  const url = `${apiComplaintsGet}/${complaintsId}`;
  return api.delete(url, cancelToken);
};

const PAGE_COMPLAINTS_PREFIX = "/master-data/pengaduan";
export const PAGE_COMPLAINTS_HOME = `${PAGE_COMPLAINTS_PREFIX}`;
export const PAGE_COMPLAINTS_CREATE = `${PAGE_COMPLAINTS_PREFIX}/create`;
export const PAGE_COMPLAINTS_EDIT = `${PAGE_COMPLAINTS_PREFIX}/edit/:id`;
