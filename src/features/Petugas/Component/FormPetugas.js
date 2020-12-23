/* eslint-disable camelcase */
import React from "react";
import * as yup from "yup";
import cn from "classnames";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";
import { Formik } from "formik";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";
import PageHeader from "../../../provider/Display/PageHeader";
import LoadingCard from "../../../provider/Display/LoadingCard";
import InputSelectLong from "../../../provider/Commons/InputSelectLong";
import InputDate from "../../../provider/Commons/InputDate";
import {
  apiUsersGet,
  apiUsersStore,
  apiUsersUpdate,
  PAGE_OFFICERS_HOME
} from "../action";
import moment from "moment";

class FormPetugas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isOpenCollapse: true,
      initialValues: {
        name: undefined,
        email: undefined,
        password: undefined,
        role: 1
      },
      genderOption: [
        { label: "Pria", value: "pria" },
        { label: "Wanita", value: "wanita" }
      ]
    };
  }

  componentDidMount() {
    this.getToUpdate();
  }

  toggleCollapse = () => {
    const { isOpenCollapse } = this.state;
    this.setState({
      isOpenCollapse: !isOpenCollapse
    });
  };

  getToUpdate = () => {
    const { match } = this.props;
    if (match.params.id) {
      this.setState(
        {
          loading: true
        },
        () => {
          this._requestSource = api.generateCancelToken();
          api
            .get(`${apiUsersGet}/${match.params.id}`, this._requestSource.token)
            .then(response => {
              const { data } = response.data;
              this.setState({
                loading: false,
                initialValues: {
                  name: data.name ? data.name : undefined,
                  email: data.email ? data.email : undefined,
                  password: data.password ? data.password : undefined,
                  gender: data.officer ? data.officer.gender : undefined,
                  address: data.officer ? data.officer.address : undefined,
                  birthday_date: data.officer
                    ? moment(data.officer.birthday_date)
                    : undefined,
                  birthday_place: data.officer
                    ? data.officer.birthday_place
                    : undefined,
                  phone_number: data.officer
                    ? data.officer.phone_number
                    : undefined
                }
              });
            })
            .catch(error => error);
        }
      );
    }
  };

  handleSubmit = async (values, actions) => {
    const { match, history } = this.props;
    const {
      password_confirmation,
      gender,
      address,
      birthday_date,
      birthday_place,
      phone_number,
      ...restValue
    } = values;
    const storeValue = restValue;
    const putValue = {
      gender,
      address,
      birthday_date,
      birthday_place,
      phone_number
    };

    try {
      this._requestSource = api.generateCancelToken();
      let response = null;
      response = !match.params.id
        ? await apiUsersStore(
            { ...storeValue, ...putValue },
            this._requestSource.token
          )
        : await apiUsersUpdate(
            match.params.id,
            { ...storeValue, ...putValue },
            this._requestSource.token
          );

      if (response.status === 200) {
        const Message = match.params.id
          ? "Data Petugas telah berhasil diubah"
          : "Berhasil Petugas baru";
        alertFloat({
          type: "success",
          content: Message
        });
        history.replace("/master-data/petugas");
      }
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }
      alertFloat({
        type: "error",
        content: error
      });
      actions.setSubmitting(false);
    }
  };

  render() {
    const { match } = this.props;
    const { initialValues, loading, isOpenCollapse } = this.state;

    if (loading) {
      return <LoadingCard />;
    }

    const FormPetugasValidation = yup.object().shape({
      name: yup.string().required("Wajib di isi"),
      email: yup
        .string()
        .email()
        .required("Wajib di isi"),
      password:
        !match.params.id &&
        yup
          .string()
          .required("Wajib di isi")
          .min(6, "Password terlalu pendek, minimal 6 karakter"),
      password_confirmation:
        !match.params.id &&
        yup
          .string()
          .oneOf([yup.ref("password")], "Password tidak sesuai")
          .required("Password konfirmasi Wajib diisi"),
      role: yup.string().nullable(),
      avatar: yup.string().nullable(),

      gender: yup.string().required("Wajib di isi"),
      address: yup.string().required("Wajib di isi"),
      birthday_place: yup.string().required("Wajib di isi"),
      birthday_date: yup.date().required("Wajib di isi"),
      phone_number: yup
        .string()
        .nullable()
        .matches(/^[0-9]+$/, "Gunakan Angka")
        .length(12, "Harus 12 karakter")
    });
    return (
      <React.Fragment>
        <PageHeader
          title="Formulir Petugas"
          subtitle={
            <div className="breadcrumb pb-0">
              <div className="breadcrumb-item">
                <Link to={PAGE_OFFICERS_HOME} className="breadcrumb-item-link">
                  <i className="la la-home" /> Daftar Petugas
                </Link>
              </div>
              <div className="breadcrumb-item">
                <i className="la la-edit" />
                Formulir Petugas
              </div>
            </div>
          }
          showWrapper
        />
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={FormPetugasValidation}
              onSubmit={this.handleSubmit}
            >
              {({
                setFieldValue,
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isSubmitting
              }) => (
                <form className="form-horizontal p-4" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-24">
                      <div className="form-group">
                        <label className="form-label" htmlFor="label_name">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="name"
                          value={values.name || ""}
                        />
                        {errors && errors.name && (
                          <p className="text-danger">{errors.name}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="label_name">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="email"
                          value={values.email || ""}
                        />
                        {errors && errors.email && (
                          <p className="text-danger">{errors.email}</p>
                        )}
                      </div>

                      {!match.params.id && (
                        <div className="form-group">
                          <label className="form-label" htmlFor="label_name">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="password"
                            value={values.password || ""}
                          />
                          {errors && errors.password && (
                            <p className="text-danger">{errors.password}</p>
                          )}
                        </div>
                      )}

                      {!match.params.id && (
                        <div className="form-group">
                          <label className="form-label" htmlFor="label_name">
                            Password Konfirmasi
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password Konfirmasi"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="password_confirmation"
                            value={values.password_confirmation || ""}
                          />
                          {errors && errors.password_confirmation && (
                            <p className="text-danger">
                              {errors.password_confirmation}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="form-group">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary mr-auto"
                          onClick={this.toggleCollapse}
                        >
                          {isOpenCollapse ? (
                            <React.Fragment>
                              Show Less <i className="la la-caret-up" />
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              Show More <i className="la la-caret-down" />
                            </React.Fragment>
                          )}
                        </button>
                      </div>

                      <Collapse isOpen={isOpenCollapse}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="label_name">
                            Jenis Kelamin
                          </label>
                          <InputSelectLong
                            name="gender"
                            options={this.state.genderOption}
                            className="w-100"
                            placeholder="Jenis Kelamin"
                            value={values.gender}
                            onChange={value => setFieldValue("gender", value)}
                          />
                          {errors && errors.gender && (
                            <p className="text-danger">{errors.gender}</p>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="label_name">
                            Alamat
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Alamat"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="address"
                            value={values.address || ""}
                          />
                          {errors && errors.address && (
                            <p className="text-danger">{errors.address}</p>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="label_name">
                            Tempat Lahir
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tempat Lahir"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="birthday_place"
                            value={values.birthday_place || ""}
                          />
                          {errors && errors.birthday_place && (
                            <p className="text-danger">
                              {errors.birthday_place}
                            </p>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="label_name">
                            Tanggal Lahir
                          </label>
                          <InputDate
                            name="birthday_date"
                            handleChange={value =>
                              setFieldValue("birthday_date", value)
                            }
                            isBlockAfterToday={false}
                            value={values.birthday_date}
                          />
                          {errors && errors.birthday_date && (
                            <p className="text-danger">
                              {errors.birthday_date}
                            </p>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="label_name">
                            Telepon
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Telepon"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="phone_number"
                            value={values.phone_number || ""}
                          />
                          {errors && errors.phone_number && (
                            <p className="text-danger">{errors.phone_number}</p>
                          )}
                        </div>
                      </Collapse>

                      <div className="form-group mb-0">
                        <button
                          type="submit"
                          className="btn pull-right mr-1 btn-primary"
                          disabled={isSubmitting}
                        >
                          <i
                            className={cn({
                              la: true,
                              "la-save": !isSubmitting,
                              "la-circle-o-notch animate-spin": isSubmitting
                            })}
                          />{" "}
                          {isSubmitting ? "Submitting" : "Submit"}
                        </button>
                        <Link
                          to="/master-data/petugas"
                          className="btn pull-right mr-1 btn-danger"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default FormPetugas;
