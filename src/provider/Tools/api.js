import axios from "axios";
import { CLIENT_API } from "./general";

export const AXIOS_CANCEL_MESSAGE = "Request Cancelled";

const service = axios.create({
  baseURL: CLIENT_API,
  headers: {
    "Content-Type": "application/json"
  }
});

axios.interceptors.response.use(axios.defaults, error => {
  if (error.code === "ECONNABORTED") {
    const eTimeout = new Error(
      "Request take longer than expected. Aborting process"
    );
    return Promise.reject(eTimeout);
  }

  return Promise.reject(error);
});

const api = {
  get: (url, cancelToken, requestOptions = {}) =>
    service({ ...requestOptions, method: "get", url, cancelToken }),
  post: (url, data, cancelToken, requestOptions) =>
    service({ ...requestOptions, method: "post", url, data, cancelToken }),
  put: (url, data, cancelToken, requestOptions = {}) =>
    service({ ...requestOptions, method: "put", url, data, cancelToken }),
  patch: (url, data, cancelToken, requestOptions = {}) =>
    service({ ...requestOptions, method: "patch", url, data, cancelToken }),
  delete: (url, data, cancelToken, requestOptions = {}) =>
    service({ ...requestOptions, method: "delete", url, data, cancelToken }), // data,
  setToken: (type, token) => {
    if (type && token) {
      service.defaults.headers.common.Authorization = `${type} ${token}`;
    }
  },
  unsetToken: () => {
    delete service.defaults.headers.common.Authorization;
  },
  generateCancelToken: () => axios.CancelToken.source()
};

export const axiosError = e => {
  if (axios.isCancel(e)) {
    return AXIOS_CANCEL_MESSAGE;
  }
  const { message, response } = e;
  let error = message;
  if (response) {
    if (response.data.error) {
      // eslint-disable-next-line prefer-destructuring
      error = response.data.error;
    } else if (response.data.message) {
      error = response.data.message;
    }

    if (error === "Unauthenticated") {
      api.unsetToken();
    }
  }

  return error;
};

export default api;
