import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import * as yup from "yup";
import cn from "classnames";
import alertFloat from "../../../provider/Display/alertFloat";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import { apiEditProfile } from "../action";
import "../Style/style.css";

const formMailValidation = yup.object().shape({
  email: yup
    .string()
    .email("Current value is not an email")
    .required("Email is required")
});

class FormEditMail extends React.PureComponent {
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
    const { initialValues } = this.props;
    return (
      <React.Fragment>
        <Formik
          initialValues={initialValues}
          validationSchema={formMailValidation}
          onSubmit={this.handleSubmit}
          render={({
            handleChange,
            handleBlur,
            values,
            handleSubmit,
            isSubmitting,
            errors
            //
          }) => (
            <div className="row">
              <div className="col-lg-24">
                <form className="form-horizontal p-4" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Email
                    </label>
                    <input
                      type="email"
                      className={"form-control"}
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      autoComplete="off"
                    />
                    {errors && errors.email && (
                      <p className="text-danger">{errors.email}</p>
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

export default connect(mapStateToProps)(FormEditMail);
