import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import moment from "moment";
// import * as yup from "yup";
import cn from "classnames";
import InputDate from "../../../provider/Commons/InputDate";
import InputSelectLong from "../../../provider/Commons/InputSelectLong";
import InputImage from "../../../provider/Commons/InputImage";
import alertFloat from "../../../provider/Display/alertFloat";
import LoadingCard from "../../../provider/Display/LoadingCard";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import "../Style/style.css";
import { apiEditProfile } from "../action";

// const formEditProfileValidation = yup.object().shape({
//   profile_image: yup.string().nullable("profile_image is ???"),
//   name: yup.string().nullable("Real Name is ???"),
//   username: yup.string().nullable("Username is ???"),
//   // .matches(/^[a-zA-Z0-9]*$/, "Must alphanumeric value")
//   // .lowercase("Username should be lowercase")
//   // .trim()
//   gender: yup.string().nullable("Gender is ???"),
//   birth: yup.string().nullable("Birth is ???"),
// });

class FormEditProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = async (values, actions) => {
    const {
      // profile_picture,
      previewAvatar,
      // avatar_path,
      birth,
      id,
      email,
      email_verified_at,
      role,
      phone_number,
      created_at,
      updated_at,
      boards,
      friends,
      friend_requests,
      requested_friends,
      board_invitation_request,
      requested_board_invitation,
      notifications,
      ...allValues
    } = values;
    try {
      this.props.handleLoading(true);
      this._requestSource = api.generateCancelToken();

      const newValues = {
        ...allValues,
        birth:
          birth && typeof birth.format === "function"
            ? birth.format("YYYY-MM-DD")
            : undefined
      };

      const newFormData = new FormData();
      Object.keys(newValues).forEach(index => {
        if (newValues[index]) {
          newFormData.append(index, newValues[index]);
        }
      });

      const response = await apiEditProfile(
        newFormData,
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
    const { loadingProfile } = this.state;
    const { initialValues } = this.props;

    if (loadingProfile) {
      return <LoadingCard />;
    }

    return (
      <React.Fragment>
        <Formik
          initialValues={initialValues}
          // validationSchema={formEditProfileValidation}
          onSubmit={this.handleSubmit}
          render={({
            setFieldValue,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            values
          }) => (
            <div className="row">
              <div className="col-lg-24">
                <form className="form-horizontal p-4" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Profile Photo
                    </label>
                    <InputImage
                      name="profile_picture"
                      onFileChange={(file, result) => {
                        setFieldValue("previewAvatar", result);
                        setFieldValue("profile_picture", file);
                      }}
                      placeholder="Choose your avatar"
                      multiple={false}
                      previewImage={values.previewAvatar}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Real Name
                    </label>
                    <input
                      type="text"
                      className={"form-control"}
                      placeholder="Real Name"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Username
                    </label>
                    <input
                      type="text"
                      className={"form-control"}
                      placeholder="Username"
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Gender
                    </label>
                    <InputSelectLong
                      className="form-control"
                      name="gender"
                      onChange={value => setFieldValue("gender", value)}
                      options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" }
                      ]}
                      placeholder="Gender"
                      value={values.gender || undefined}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Birth of Date
                    </label>
                    <InputDate
                      name="birth"
                      handleChange={value => setFieldValue("birth", value)}
                      value={values.birth ? moment(values.birth) : undefined}
                      isBlockAfterToday={false}
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

export default connect(mapStateToProps)(FormEditProfile);
