import React from "react";
import { connect } from "react-redux";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import cn from "classnames";
import api from "../../../provider/Tools/api";
import { apiSignInAction, AUTH_SET_LOGIN, saveToken } from "../action";
import alertFloat from "../../../provider/Display/alertFloat";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import logoLanding from "../../../assets/images/logo-landing.jpeg";
import logoTitle from "../../../assets/images/logo-title.png";
import "../Style/style.css";

const formRegisterValidation = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  username: yup.string().required("Username is required"),
  // .matches(/^[a-zA-Z0-9]*$/, "Must alphanumeric value")
  // .lowercase("Username should be lowercase")
  // .trim()
  email: yup
    .string()
    .email("Current value is not an email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password too short"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Password is not same")
    .required("Password confirmation is required")
});

class PageRegister extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: {
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        username: undefined,
        password: undefined,
        password_confirmation: undefined
      }
    };
  }

  handleSubmit = async (values, actions) => {
    const {
      password_confirmation,
      first_name,
      last_name,
      ...allValues
    } = values;
    const name = `${first_name} ${last_name}`;
    const newValue = { name, ...allValues };
    try {
      this._requestSource = api.generateCancelToken();

      const response = await apiSignInAction(
        newValue,
        this._requestSource.token
      );
      const { data } = response;

      api.setToken(data.type, data.token);

      saveToken(data.token);

      this.props.setLogin({
        token: data.token,
        user: data.data,
        type: data.type
      });

      if (response.status === 200) {
        alertFloat({
          type: "success",
          content: data.message
        });
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
    const { initialValues } = this.state;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row p-5">
            <div className="col-lg-11">
              <div>
                <img
                  className="m-auto"
                  src={logoLanding}
                  width="500"
                  height="500"
                  alt=""
                />
              </div>
            </div>

            <div className="col-lg-9 m-auto">
              <div className="">
                {" "}
                <div className="text-center">
                  <img
                    className="mx-auto text-center"
                    src={logoTitle}
                    width="100"
                    height="100"
                    alt=""
                  />
                </div>
                <Formik
                  initialValues={initialValues}
                  validationSchema={formRegisterValidation}
                  onSubmit={this.handleSubmit}
                  render={({
                    handleChange,
                    isSubmitting,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors
                  }) => (
                    <form
                      className="form-horizontal p-4"
                      onSubmit={handleSubmit}
                    >
                      <div className="row">
                        <div className="col-lg-24">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="label_name"
                                >
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  className={"form-control"}
                                  placeholder="First Name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="first_name"
                                  values={values.first_name}
                                  autoComplete="off"
                                />
                                {errors && errors.first_name && (
                                  <p className="text-danger">
                                    {errors.first_name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="label_name"
                                >
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  className={"form-control"}
                                  placeholder="Last Name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="last_name"
                                  values={values.last_name}
                                  autoComplete="off"
                                />
                                {errors && errors.last_name && (
                                  <p className="text-danger">
                                    {errors.last_name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="label_name">
                              Email
                            </label>
                            <input
                              type="text"
                              className={"form-control"}
                              placeholder="Email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="email"
                              values={values.email}
                              autoComplete="off"
                            />
                            {errors && errors.email && (
                              <p className="text-danger">{errors.email}</p>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="label_name">
                              Username
                            </label>
                            <input
                              type="text"
                              className={"form-control"}
                              placeholder="Username"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="username"
                              values={values.username}
                              autoComplete="off"
                            />
                            {errors && errors.username && (
                              <p className="text-danger">{errors.username}</p>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="label_name">
                              Password
                            </label>
                            <input
                              type="password"
                              className={"form-control"}
                              placeholder="Password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="password"
                              values={values.password}
                              autoComplete="off"
                            />
                            {errors && errors.password && (
                              <p className="text-danger">{errors.password}</p>
                            )}
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="label_name">
                              Re-type Password
                            </label>
                            <input
                              type="password"
                              className={"form-control"}
                              placeholder="Re-type Password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="password_confirmation"
                              values={values.password_confirmation}
                              autoComplete="off"
                            />
                            {errors && errors.password_confirmation && (
                              <p className="text-danger">
                                {errors.password_confirmation}
                              </p>
                            )}
                          </div>

                          <div className="form-group ">
                            <button
                              type="submit"
                              className="btn btn-block btn-primary"
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
                          </div>

                          <div className="form-footer d-flex flex-row flex-nowrap justify-content-center align-items-center mt-2">
                            <Link
                              to="/login"
                              className="btn btn-link text-primary font-weight-bold"
                            >
                              Do you have Account? / Login
                            </Link>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user,
  token: store.auth.token
});

const mapDispatchToProps = dispatch => ({
  setLogin: payload =>
    dispatch({
      type: AUTH_SET_LOGIN,
      payload
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(PageRegister);
