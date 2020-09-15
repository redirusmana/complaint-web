/* eslint-disable camelcase */
import React from "react";
// import { connect } from "react-redux";
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
  apiOfficersGet,
  // apiOfficersStore,
  apiOfficersUpdate,
  FormPetugasValidation,
  PAGE_OFFICERS_HOME
} from "../action";

class FormPetugas extends React.Component {
  constructor(props) {
    super(props);
    // const { user } = this.props;
    this.state = {
      loading: false,
      isOpenCollapse: true,
      fetchingNumberMessage: false,
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
            .get(
              `${apiOfficersGet}/${match.params.id}`,
              this._requestSource.token
            )
            .then(response => {
              const { result } = response.data;
              this.setState({
                loading: false,
                initialValues: {
                  name: result.name ? result.name : undefined,
                  email: result.name ? result.name : undefined,
                  password: result.name ? result.name : undefined,
                  role: 1
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
    // const { password_confirmation, ...restValue } = values;

    try {
      this._requestSource = api.generateCancelToken();

      let response = null;
      if (match.params.id) {
        response = await apiOfficersUpdate(
          match.params.id,
          values,
          this._requestSource.token
        );
      }

      console.log(values);
      // else {
      //   response = await apiOfficersStore(
      //     restValue,
      //     this._requestSource.token
      //   );
      // }
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
    // const { match } = this.props;
    const {
      initialValues,
      loading,
      fetchingNumberMessage,
      isOpenCollapse
    } = this.state;

    if (loading) {
      return <LoadingCard />;
    }
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
                          type="text"
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

                      <div className="form-group">
                        <label className="form-label" htmlFor="label_name">
                          Password
                        </label>
                        <input
                          type="text"
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

                      <div className="form-group">
                        <label className="form-label" htmlFor="label_name">
                          Password Konfirmasi
                        </label>
                        <input
                          type="text"
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

                      <div className="form-group">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary mr-auto"
                          onClick={this.toggleCollapse}
                        >
                          Show More <i className="la la-caret-down" />
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
                          disabled={isSubmitting || !!fetchingNumberMessage}
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
// const mapStateToProps = reduxState => ({
//   user: reduxState.auth.user
// });

// export default connect(mapStateToProps)(FormPetugas);
export default FormPetugas;
