import api from "./provider/Tools/api";

export const APP_LOAD = "APP_LOAD";

export const doVerify = cancelToken => api.get("/api/auth/info", cancelToken);
