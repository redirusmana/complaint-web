import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import cn from "classnames";
import { apiFoundFriend } from "../action"; //apiAddFriend,
import api from "../../../provider/Tools/api";
import "../Style/style.css";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";

const formAddFriendValidation = yup.object().shape({
  email: yup
    .string()
    .email("Current value is not an email")
    .required("Field Email Must be filled in First")
});

class FormAddFriend extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: {
        email: ""
      }
    };
  }

  handleSubmit = async (values, actions) => {
    try {
      this.props.handleLoading(true);
      this._requestSource = api.generateCancelToken();
      const response = await apiFoundFriend(values, this._requestSource.token);
      const { data } = response;
      // console.log(response);

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
        // content: error
      });
    }
    actions.setSubmitting(false);
    this.props.handleClose();
    this.props.handleLoading(false);
  };

  render() {
    const { initialValues } = this.state;
    return (
      <React.Fragment>
        <Formik
          initialValues={initialValues}
          validationSchema={formAddFriendValidation}
          onSubmit={this.handleSubmit}
          render={({
            handleChange,
            handleBlur,
            values,
            handleSubmit,
            isSubmitting,
            // setFieldValue,
            // setValues,
            errors
          }) => (
            <div className="row">
              <div className="col-lg-24">
                <form className="form-horizontal p-2" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Email
                    </label>
                    <input
                      type="text"
                      className={"form-control"}
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      values={values.email}
                      autoComplete="off"
                    />
                    {errors && errors.email && (
                      <p className="text-danger">{errors.email}</p>
                    )}
                  </div>
                  <div className="form-group ">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block font-weight-bold"
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

export default FormAddFriend;
