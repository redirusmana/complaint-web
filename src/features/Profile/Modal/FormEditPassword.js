import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
// import * as yup from "yup";
// import { apiSignInAction } from "../action";
import cn from "classnames";
import alertFloat from "../../../provider/Display/alertFloat";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import { apiEditProfile } from "../action";
import "../Style/style.css";

// const formPasswordValidation = yup.object().shape({
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(6, "Password too short")
// });

// const formRegisterValidation = yup.object().shape({
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(6, "Password too short"),
//   password_confirmation: yup
//     .string()
//     .oneOf([yup.ref("password")], "Password is not same")
//     .required("Password confirmation is required")
// });

class FormEditPassWord extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = async (values, actions) => {
    const { avatar_path, ...newValues } = values;
    try {
      this.props.handleLoading(true);
      this._requestSource = api.generateCancelToken();

      const response = await apiEditProfile(
        newValues,
        this._requestSource.token
      );
      if (response.status === 200) {
        alertFloat({
          type: "success",
          content: response.data.message
        });
        this.props.handleReplace(response.data.data);
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
    }
    actions.setSubmitting(false);
    this.props.handleLoading(false);
    this.props.handleClose();
  };

  render() {
    const { user } = this.props;
    return (
      <React.Fragment>
        <Formik
          initialValues={user}
          // validationSchema={}
          onSubmit={this.handleSubmit}
          render={({
            values,
            handleSubmit,
            isSubmitting,
            handleChange,
            handleBlur
          }) => (
            <div className="row">
              <div className="col-lg-24">
                <form className="form-horizontal p-4" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Old Password
                    </label>
                    <input
                      type="password"
                      className={"form-control"}
                      placeholder="Old Password"
                      name={""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      New Password
                    </label>
                    <input
                      type="password"
                      className={"form-control"}
                      placeholder="New Password"
                      name={""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      New Password
                    </label>
                    <input
                      type="password"
                      className={"form-control"}
                      placeholder="New Password"
                      name={""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
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
                </form>
              </div>
            </div>
          )}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps)(FormEditPassWord);
