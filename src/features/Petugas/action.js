import api from "../../provider/Tools/api";
import * as yup from "yup";

export const apiOfficersGet = "api/officers";
export const apiOfficersFilter = "api/officers/filter";

export const apiOfficersStore = (data, cancelToken) => {
  const url = apiOfficersGet;
  return api.post(url, data, cancelToken);
};

export const apiOfficersUpdate = (officersId, data, cancelToken) => {
  const url = `${apiOfficersGet}/${officersId}`;
  return api.post(url, data, cancelToken);
};

export const apiOfficersDelete = (officersId, cancelToken) => {
  const url = `${apiOfficersGet}/${officersId}`;
  return api.delete(url, cancelToken);
};

const PAGE_OFFICERS_PREFIX = "/master-data/petugas";
export const PAGE_OFFICERS_HOME = `${PAGE_OFFICERS_PREFIX}`;
export const PAGE_OFFICERS_CREATE = `${PAGE_OFFICERS_PREFIX}/create`;
export const PAGE_OFFICERS_EDIT = `${PAGE_OFFICERS_PREFIX}/edit/:id`;

export const FormPetugasValidation = yup.object().shape({
  name: yup.string().required("Wajib di isi"),
  email: yup.string().required("Wajib di isi"),
  password: yup
    .string()
    .required("Wajib di isi")
    .min(6, "Password terlalu pendek, minimal 6 karakter"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Password tidak sesuai")
    .required("Password konfirmasi Wajib diisi"),
  role: yup.string().nullable(),
  avatar: yup.string().nullable()
  // nik: yup.string().when("role", {
  //   is: "2",
  //   then: yup.string().required("Wajib di isi"),
  //   otherwise: yup.string().nullable()
  // })
});
