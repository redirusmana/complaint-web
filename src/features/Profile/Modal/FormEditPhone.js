import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import * as yup from "yup";
// import { apiSignInAction } from "../action";
import cn from "classnames";
import alertFloat from "../../../provider/Display/alertFloat";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import { apiEditProfile } from "../action";
import InputNumber from "../../../provider/Commons/InputNumber";
import "../Style/style.css";

const formphoneValidation = yup.object().shape({
  phone_number: yup
    .string("Current value is not an number")
    .min(9)
    .max(12)
});

class FormEditPhone extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = async (values, actions) => {
    const { phone_number } = values;
    try {
      this.props.handleLoading(true);
      this._requestSource = api.generateCancelToken();
      const initialValues = { phone_number };

      const response = await apiEditProfile(
        initialValues,
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
          validationSchema={formphoneValidation}
          onSubmit={this.handleSubmit}
          render={({
            setFieldValue,
            handleSubmit,
            isSubmitting,
            values,
            errors
          }) => (
            <div className="row">
              <div className="col-lg-24">
                <form className="form-horizontal p-4" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Phone Number
                    </label>
                    <InputNumber
                      placeholder="Phone Number"
                      name="phone_number"
                      onChange={value => setFieldValue("phone_number", value)}
                      value={values.phone_number}
                      autoComplete="off"
                    />
                    {errors && errors.phone_number && (
                      <p className="text-danger">{errors.phone_number}</p>
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

export default connect(mapStateToProps)(FormEditPhone);
