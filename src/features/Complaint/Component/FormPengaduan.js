/* eslint-disable camelcase */
import React from "react";
import { connect } from "react-redux";
import * as yup from "yup";
import cn from "classnames";
import { Link } from "react-router-dom";
import { Input } from "reactstrap";
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
import {
  apiComplaintsGet,
  apiComplaintsStore,
  apiComplaintsUpdate,
  apiComplaintsDropdown,
  PAGE_COMPLAINTS_HOME
} from "../action";

class FormPengaduan extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      loading: false,
      nikOption: [],
      initialValues: {
        nik: user.person ? user.person.nik : undefined,
        title: undefined,
        complaint: undefined,
        status: undefined
      },
      statusOption: [
        { label: "Pending", value: "pending" },
        { label: "Progress", value: "progress" },
        { label: "Done", value: "done" }
      ]
    };
  }

  componentDidMount() {
    this.getToUpdate();
    this.getToNIKOption();
  }

  getToNIKOption = async () => {
    this._requestSource = api.generateCancelToken();
    api
      .get(apiComplaintsDropdown, this._requestSource.token)
      .then(response => {
        const { results } = response.data;
        this.setState({
          nikOption: results.data
        });
      })
      .catch(error => error);
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
            .get(
              `${apiComplaintsGet}/${match.params.id}`,
              this._requestSource.token
            )
            .then(response => {
              const { data } = response.data;
              this.setState({
                loading: false,
                initialValues: {
                  nik: data.nik,
                  title: data.title,
                  complaint: data.complaint,
                  status: data.status
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
    const { status, ...restValue } = values;
    const newValues = {
      status: status ? status : "pending",
      ...restValue
    };

    try {
      this._requestSource = api.generateCancelToken();
      let response = null;
      response = !match.params.id
        ? await apiComplaintsStore(newValues, this._requestSource.token)
        : await apiComplaintsUpdate(
            match.params.id,
            values,
            this._requestSource.token
          );

      if (response.status === 200) {
        const Message = match.params.id
          ? "Data Pengaduan telah berhasil diubah"
          : "Berhasil Pengaduan baru";
        alertFloat({
          type: "success",
          content: Message
        });
        history.replace("/master-data/pengaduan");
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
    const { user } = this.props;
    const { initialValues, loading } = this.state;

    if (loading) {
      return <LoadingCard />;
    }

    const FormPengaduanValidation = yup.object().shape({
      nik: yup
        .string()
        .required("NIK Wajib diisi")
        .matches(/^[0-9]+$/, "Gunakan Angka")
        .length(16, "Harus 16 karakter"),
      title: yup.string().required("Wajib di isi"),
      complaint: yup.string().required("Wajib di isi"),
      status: yup.string().nullable()
    });
    return (
      <React.Fragment>
        <PageHeader
          title="Formulir Pengaduan"
          subtitle={
            <div className="breadcrumb pb-0">
              <div className="breadcrumb-item">
                <Link
                  to={PAGE_COMPLAINTS_HOME}
                  className="breadcrumb-item-link"
                >
                  <i className="la la-home" /> Daftar Pengaduan
                </Link>
              </div>
              <div className="breadcrumb-item">
                <i className="la la-edit" />
                Formulir Pengaduan
              </div>
            </div>
          }
          showWrapper
        />
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={FormPengaduanValidation}
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
                          NIK
                        </label>
                        <InputSelectLong
                          name="nik"
                          options={this.state.nikOption}
                          className="w-100"
                          placeholder="NIK"
                          value={values.nik}
                          onChange={value => setFieldValue("nik", value)}
                          disabled={user.person ? user.person.nik : false}
                        />
                        {/* <input
                          type="text"
                          className="form-control"
                          placeholder="NIK"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="nik"
                          value={values.nik || ""}
                          disabled={user.person ? user.person.nik : false}
                        /> */}
                        {errors && errors.nik && (
                          <p className="text-danger">{errors.nik}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="label_name">
                          Judul
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Judul"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="title"
                          value={values.title || ""}
                        />
                        {errors && errors.title && (
                          <p className="text-danger">{errors.title}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="label_name">
                          Complaint
                        </label>
                        <Input
                          type="textarea"
                          className="form-control"
                          placeholder="Complaint"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="complaint"
                          value={values.complaint || ""}
                        />
                        {errors && errors.complaint && (
                          <p className="text-danger">{errors.complaint}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="label_name">
                          Status
                        </label>
                        <InputSelectLong
                          name="status"
                          options={this.state.statusOption}
                          className="w-100"
                          placeholder="Status"
                          value={values.status}
                          onChange={value => setFieldValue("status", value)}
                        />
                        {errors && errors.status && (
                          <p className="text-danger">{errors.status}</p>
                        )}
                      </div>

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
                          to="/master-data/pengaduan"
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

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps)(FormPengaduan);
