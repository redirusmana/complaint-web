/* eslint-disable camelcase */
import React from "react";
// import { connect } from "react-redux";
import cn from "classnames";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import api from "../../../provider/Tools/api";
import {
  axiosError,
  AXIOS_CANCEL_MESSAGE
} from "../../../provider/Tools/converter";
import alertFloat from "../../../provider/Display/alertFloat";
import PageHeader from "../../../provider/Display/PageHeader";
import LoadingCard from "../../../provider/Display/LoadingCard";
import {
  apiOfficersGet,
  apiOfficersStore,
  apiOfficersUpdate,
  FormPetugasValidation
} from "../action";

class FormPetugas extends React.Component {
  constructor(props) {
    super(props);
    // const { user } = this.props;
    this.state = {
      loading: false,
      fetchingNumberMessage: false,
      initialValues: {
        name: undefined,
        email: undefined,
        password: undefined,
        role: 1
        // ,avatar: undefined
      }
    };
  }

  componentDidMount() {
    this.getToUpdate();
  }

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
                  // ,avatar: result.name ? result.name : undefined
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

    try {
      this._requestSource = api.generateCancelToken();

      let response = null;
      if (match.params.id) {
        response = await apiOfficersUpdate(
          match.params.id,
          values,
          this._requestSource.token
        );
      } else {
        response = await apiOfficersStore(values, this._requestSource.token);
      }
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
    const { initialValues, loading, fetchingNumberMessage } = this.state;

    if (loading) {
      return <LoadingCard />;
    }
    return (
      <React.Fragment>
        <PageHeader title="Formulir Petugas" showWrapper />
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={FormPetugasValidation}
              onSubmit={this.handleSubmit}
              render={({
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
            />
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
