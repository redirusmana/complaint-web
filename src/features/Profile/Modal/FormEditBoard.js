import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import * as yup from "yup";
import cn from "classnames";
import { apiUpdateBoard } from "../action"; //apiAddFriend,
import InputSelectLong from "../../../provider/Commons/InputSelectLong";
import api from "../../../provider/Tools/api";
import "../Style/style.css";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";

const FormEditBoardValidation = yup.object().shape({
  title: yup.string().required("Field Title Must be filled in First"),
  visibility: yup.string().required("Field Visibility Must be filled in First")
});

class FormEditBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = async (values, actions) => {
    const { initialValue } = this.props;
    const { title, visibility } = values;
    const newResult = {
      title,
      visibility
    };
    try {
      this.props.handleLoading(true);
      this._requestSource = api.generateCancelToken();

      const response = await apiUpdateBoard(
        newResult,
        initialValue.id,
        this._requestSource.token
      );
      const { data } = response;

      if (response.status === 200) {
        alertFloat({
          type: "success",
          content: data.message
        });
        this.props.handleReplace(data.boards);
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
    const { initialValue } = this.props;
    return (
      <React.Fragment>
        <Formik
          initialValues={initialValue}
          validationSchema={FormEditBoardValidation}
          onSubmit={this.handleSubmit}
          render={({
            handleChange,
            handleBlur,
            values,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            errors
          }) => (
            <div className="row">
              <div className="col-lg-24">
                <form className="form-horizontal p-2" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Title Board
                    </label>
                    <input
                      name="title"
                      type="text"
                      className="form-control"
                      placeholder="Title Board"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                      autoComplete="off"
                    />
                    {errors && errors.title && (
                      <p className="text-danger">{errors.title}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Visibility
                    </label>
                    <InputSelectLong
                      className="form-control"
                      name="visibility"
                      onChange={value => setFieldValue("visibility", value)}
                      options={[
                        { label: "Public", value: "public" },
                        { label: "Private", value: "private" }
                      ]}
                      placeholder="Visibility"
                      value={values.visibility || undefined}
                    />
                    {errors && errors.visibility && (
                      <p className="text-danger">{errors.visibility}</p>
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

const mapStateToProps = store => ({
  user: store.auth.user
});

export default connect(mapStateToProps)(FormEditBoard);
