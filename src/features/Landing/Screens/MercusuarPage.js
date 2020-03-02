import React from "react";
// import { Link } from "react-router-dom";
import logoLanding from "../../../assets/images/logo-landing.jpeg";
import "../Style/style.css";

class MercusuarPage extends React.PureComponent {
  render() {
    const { history } = this.props;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row p-5">
            <div className="col-lg-9 m-auto">
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg rounded-pill m-5"
                  onClick={history.goBack}
                >
                  Back To Home
                </button>
              </div>
            </div>
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MercusuarPage;
