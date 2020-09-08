import api from "../../provider/Tools/api";

export const apiOfficersGet = "api/complaints";

export const apiNewComplaintGet = (data, cancelToken) => {
  const url = apiOfficersGet;
  return api.post(url, data, cancelToken);
};
export const PAGE_DASHBOARD_PREFIX = "/dashboard";
